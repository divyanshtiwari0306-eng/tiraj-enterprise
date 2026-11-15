import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'node:crypto'
export const runtime='nodejs'
const PRICES: Record<number,number>={1:1499,2:1299,3:1299,4:1249,5:1399,6:1349,7:1299,8:1449,9:1199}
export async function POST(request:NextRequest){
 try{
  const body=await request.json();const {razorpay_order_id,razorpay_payment_id,razorpay_signature,items,customer}=body
  if(!razorpay_order_id||!razorpay_payment_id||!razorpay_signature||!Array.isArray(items)||!items.length||!customer?.name||!/^[0-9]{10}$/.test(customer.phone))return NextResponse.json({error:'Missing payment or order details.'},{status:400})
  const secret=process.env.RAZORPAY_KEY_SECRET;if(!secret)return NextResponse.json({error:'Payment verification is not configured.'},{status:503})
  const expected=createHmac('sha256',secret).update(razorpay_order_id+'|'+razorpay_payment_id).digest('hex')
  const a=Buffer.from(expected,'hex'),b=Buffer.from(String(razorpay_signature),'hex');if(a.length!==b.length||!timingSafeEqual(a,b))return NextResponse.json({error:'Payment signature verification failed.'},{status:400})
  const subtotal=items.reduce((sum:number,item:{id:number;quantity:number})=>{const price=PRICES[item.id],qty=Math.floor(Number(item.quantity));if(!price||!Number.isInteger(qty)||qty<1||qty>20)throw new Error('Invalid item');return sum+price*qty},0)
  const paidAmount=Math.round(subtotal*.95*100)/100
  const auth=Buffer.from((process.env.RAZORPAY_KEY_ID||'')+':'+secret).toString('base64')
  const paymentRes=await fetch('https://api.razorpay.com/v1/payments/'+encodeURIComponent(razorpay_payment_id),{headers:{Authorization:'Basic '+auth},cache:'no-store'});const payment=await paymentRes.json()
  if(!paymentRes.ok||payment.order_id!==razorpay_order_id||payment.status!=='captured'||payment.amount!==Math.round(paidAmount*100)||payment.currency!=='INR')return NextResponse.json({error:'Payment is not captured or the amount does not match.'},{status:400})
  return NextResponse.json({verified:true,orderId:'TIRAJ-'+razorpay_payment_id.slice(-8).toUpperCase(),paidAmount,discount:Math.round(subtotal*.05*100)/100})
 }catch(error){return NextResponse.json({error:error instanceof Error?error.message:'Verification failed.'},{status:400})}
}
