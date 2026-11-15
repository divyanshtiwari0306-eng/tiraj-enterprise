# TIRAJ ENTERPRISE — Razorpay checkout setup

## Requirements
- Node.js 20.9 or newer
- Razorpay account with Checkout enabled
- A deployed HTTPS domain for production

## Install and run locally (Windows PowerShell)
1. Extract the project ZIP.
2. Open the project folder in VS Code.
3. Run `npm.cmd install`.
4. Copy `.env.example` to `.env.local`.
5. Add your Razorpay **test** Key ID and Key Secret to `.env.local`. Keep the secret server-side; never commit it or share it in chat.
6. Run `npm.cmd run dev` and open `http://localhost:3000`.
7. Test with Razorpay test mode credentials and test payment methods from the Razorpay Dashboard documentation. Do not use real customer payments until live keys and account settings are configured.

## Production on Vercel
In Project → Settings → Environment Variables, add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` for the Production environment, then redeploy. Add the same variables to Preview if you want preview checkout tests. Do not put the secret in a `NEXT_PUBLIC_` variable.

## Checkout behavior
- COD remains available.
- Online checkout creates the order on the server from the fixed product-price catalogue and applies the 5% prepaid discount.
- After Checkout returns, the server verifies the signature and confirms the payment is captured for the expected amount before showing success.
- UPI apps (including Google Pay) are displayed only when supported and enabled for the merchant account, transaction, and customer's device. The site cannot force Google Pay to appear.
- WhatsApp chat button opens +91 70202 73446.

## Important production notes
- Configure Razorpay account activation, payment capture, eligible UPI methods, domain and settlement details in Razorpay Dashboard.
- The current project stores the last order in the customer's browser local storage; it does **not** yet provide durable server-side order storage/admin order management. Do not treat local browser storage as an order-management database. Add a production database/order model before relying on an admin order ledger.
- Signature verification is not a substitute for webhook reconciliation. Configure Razorpay webhooks and persistent order records before production launch.
