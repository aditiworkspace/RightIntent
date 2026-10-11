# Aditi Provider Setup

`New RTF Text.md` is the product brief. The current implementation uses:

- Supabase Auth for email OTP, phone SMS OTP, Google OAuth, and sessions.
- MongoDB Atlas for profiles, addresses, products, carts, orders, coupons, and inventory.
- Razorpay for server-created INR payment orders and verified webhooks.

## Supabase Auth

1. Open Supabase Dashboard -> Authentication -> Providers.
2. Enable Email.
3. Enable phone authentication and choose an SMS provider such as Twilio, Vonage, or MessageBird.
4. Configure the provider credentials and sender settings in Supabase. Do not put SMS credentials in browser code or MongoDB.
5. Add the local and production callback URLs:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR_DOMAIN/auth/callback`
6. Enable email OTP/magic-link authentication. The login page calls `signInWithOtp({ email })` and `verifyOtp({ email, token, type: "email" })`.
7. For Gmail delivery, configure a custom SMTP provider in Supabase Auth. Use Gmail SMTP only with a Google App Password, never a normal Gmail password. Supabase hosted projects use the Dashboard SMTP settings; the app does not send or store Gmail credentials.
8. Add Google OAuth credentials in Authentication -> Providers -> Google. Set the Google redirect URI to the Supabase callback URL shown in the provider settings.

The phone flow calls Supabase Auth directly:

```ts
await supabase.auth.signInWithOtp({ phone: "+919876543210" });
await supabase.auth.verifyOtp({ phone, token, type: "sms" });
```

OTP values are never stored by this application.

## Razorpay

1. Create a Razorpay account and obtain Test or Live API credentials.
2. Put the values in `.env.local`:

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
RAZORPAY_CURRENCY=INR
RAZORPAY_WEBHOOK_URL=http://localhost:3000/api/webhooks/razorpay
```

3. Configure the Razorpay webhook endpoint:
   - Local testing: expose the app through a real tunnel URL, then use `https://YOUR_TUNNEL/api/webhooks/razorpay`.
   - Production: `https://YOUR_DOMAIN/api/webhooks/razorpay`.
4. Subscribe to `payment.captured`, `payment.failed`, and `order.paid`.
5. Keep `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` server-only.
6. The server creates Razorpay orders after re-reading MongoDB prices and stock. The browser never supplies the final amount.
7. The server verifies the checkout signature, then decrements stock and marks the order paid. Webhooks reconcile provider events independently.

## Test checklist

- Email OTP: use a real Gmail address after SMTP is configured.
- Phone OTP: use a verified test number/provider account.
- Razorpay: use Test Mode credentials and Razorpay test payment methods.
- Confirm invalid signatures return `400`.
- Confirm missing Razorpay credentials return `503`.
- Confirm a client-submitted price is ignored.
- Confirm an out-of-stock item cannot create an order.
