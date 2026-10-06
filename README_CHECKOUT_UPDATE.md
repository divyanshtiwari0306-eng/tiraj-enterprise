# TIRAJ Ecommerce Checkout Update

Implemented in this build:

- Auto-sliding hero with multiple TIRAJ stand visuals plus a washing-machine-on-stand illustration.
- Product cards now have **Buy Now** and **Add to Cart**.
- Cart quantities are persisted in browser localStorage.
- Full checkout form: name, phone, email, address, city, state and PIN code.
- **Cash on Delivery (COD)** checkout flow.
- **UPI / QR** checkout flow using the supplied QR image and UPI ID, with UTR/reference field.
- Order ID generation and local order record in browser localStorage.
- Post-order WhatsApp confirmation link to TIRAJ ENTERPRISE.

Important: the QR flow is a manual UPI payment flow. Automatic payment verification requires a real payment gateway/API (for example Razorpay/Cashfree/PhonePe Business) and backend credentials. Permanent multi-device order storage also requires a configured production database/backend.
