import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'
const PRICES: Record<number, number> = {1:1499,2:1299,3:1299,4:1249,5:1399,6:1349,7:1299,8:1449,9:1199}
export async function POST(request: NextRequest) {
  try {
    const { items, customer } = await request.json()
    if (!Array.isArray(items) || !items.length || !customer?.name || !/^[0-9]{10}$/.test(customer.phone) || !customer.address || !customer.city || !/^[0-9]{6}$/.test(customer.pincode)) return NextResponse.json({error:'Valid order and delivery details are required.'},{status:400})
    const subtotal = items.reduce((sum: number, item: {id:number;quantity:number}) => { const price=PRICES[item.id]; const qty=Math.floor(Number(item.quantity)); if(!price || !Number.isInteger(qty) || qty<1 || qty>20) throw new Error('Invalid product or quantity'); return sum+price*qty },0)
    const amount = Math.round(subtotal * 0.95 * 100) / 100
    const keyId=process.env.RAZORPAY_KEY_ID, secret=process.env.RAZORPAY_KEY_SECRET
    if(!keyId||!secret) return NextResponse.json({error:'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the server environment.'},{status:503})
    const auth=Buffer.from(keyId+':'+secret).toString('base64')
    const response=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{Authorization:'Basic '+auth,'Content-Type':'application/json'},body:JSON.stringify({amount:Math.round(amount*100),currency:'INR',receipt:'tiraj_'+Date.now(),notes:{customer_name:String(customer.name).slice(0,100),customer_phone:String(customer.phone)}}),cache:'no-store'})
    const order=await response.json(); if(!response.ok) return NextResponse.json({error:order.error?.description||'Razorpay order creation failed.'},{status:502})
    return NextResponse.json({orderId:order.id,amount:order.amount,keyId,discount:Math.round(subtotal*5)/100,subtotal})
  } catch(error) { return NextResponse.json({error:error instanceof Error?error.message:'Unable to create order.'},{status:400}) }
}
