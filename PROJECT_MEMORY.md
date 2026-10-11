- Added the initial Supabase migration, seed data, local Supabase config, normalized commerce tables, indexes, auth profile trigger, admin helper, and RLS policies under `supabase/`.
- Added shared Zod validation, server-side pricing helpers, Supabase browser/server/admin clients, auth callback/login, proxy session refresh, protected account routes, and server-checked admin route surfaces.
- Added the requested storefront and admin URL surfaces with responsive route styling.
- Added `sitemap.ts`, `robots.ts`, global loading, not-found, and error boundaries.
- Final validation passes: `npm run lint` and `npm run build`; the build generated 33 routes with the Next.js 16 `proxy` convention.
# Aditi Project Memory

Last updated: 2026-09-29

## Product

Aditi is being built as a premium Indian e-commerce brand for physical lifestyle products. The storefront direction is editorial, warm, tactile, and conversion-focused rather than a generic Shopify-style template.

## Stack

- Next.js 16 App Router with TypeScript and strict mode
- React 19
- Tailwind CSS 4 via PostCSS
- ESLint with Next.js core web vitals and TypeScript rules
- lucide-react for interface icons
- Supabase packages installed: `@supabase/ssr`, `@supabase/supabase-js`
- Validation/forms installed: `zod`, `react-hook-form`, `@hookform/resolvers`
- Client state installed: `zustand`
- Payments installed: `razorpay`
- Intended deployment: Vercel + Supabase Auth/Storage + MongoDB Atlas + Razorpay

## Governing Brief

`New RTF Text.md` is the primary product and feature brief. `UI_prompt.md` governs visual direction. The latest architecture decision intentionally uses both Supabase and MongoDB: Supabase remains the identity and storage service; MongoDB is the application database. This supersedes the brief's Supabase PostgreSQL database choice.

## Current Structure

- `src/app/page.tsx`: current client-rendered premium homepage
- `src/app/globals.css`: Aditi visual system and responsive styles
- `src/app/layout.tsx`: root metadata and global stylesheet
- `src/app/icon.svg`: Aditi favicon
- `src/lib/products.ts`: temporary sample catalog and category data
- `.env.example`: placeholder environment contract
- `README.md`: local setup and implementation roadmap
- `New RTF Text.md`: production architecture brief
- `UI_prompt.md`: storefront UI/UX brief

## Completed

- Scaffolded a Next.js TypeScript App Router project in the workspace root.
- Added premium homepage sections: announcement bar, header, hero, manifesto, product edit, categories, story, trust benefits, journal, FAQ, newsletter, footer.
- Added responsive mobile navigation.
- Added accessible wishlist toggles and an animated cart drawer with add/remove/subtotal behavior.
- Added reduced-motion CSS support.
- Added replaceable Unsplash sample imagery and sample product data. These are placeholders until real product assets and catalog records are available.
- Added SEO title and description metadata.
- Added `.env.example` placeholders for Supabase, Razorpay, site URL, email, and optional Sentry.
- Added Lucide icons and the backend-oriented dependencies listed above.
- Added Mongoose, a cached MongoDB connection, MongoDB models for profiles/products/orders/coupons, and a MongoDB product seed script.
- Rewired account and admin authorization reads to MongoDB profiles while keeping Supabase Auth for identity/session handling.
- Added `npm run seed:mongodb` using `tsx scripts/seed-mongodb.ts`.
- Added persistent Zustand cart state, authenticated add-to-cart redirects, Supabase phone SMS OTP and email OTP flows, MongoDB address CRUD, saved-address checkout, and Razorpay checkout handoff/verification.
- Updated login to an identifier-first marketplace pattern based on the public Flipkart flow: phone by default, email alternative, Continue, OTP verification, Google fallback, and preserved checkout return path.
- Seeded four starter products into the configured MongoDB Atlas database.
- Replaced product listing, category, and product detail reads with MongoDB catalog queries and sample-data fallback.
- Added server-side Razorpay create-order, payment-signature verification, and webhook routes under `src/app/api/`.
- `npm run lint` passed after the storefront implementation.
- `npm run build` passed after the storefront implementation.

## Design Tokens

- Ink: `#1c2622`
- Paper: `#f4f0e9`
- Cream: `#e8e1d7`
- Terracotta accent: `#bb6249`
- Editorial serif: Playfair Display
- Utility sans: DM Sans
- Metadata mono: DM Mono

## Security Decisions

- Supabase service-role key, MongoDB URI, and Razorpay secrets must remain server-only.
- Prices, discounts, order totals, stock, user roles, and payment status must be recalculated or verified server-side.
- Admin access must be checked server-side; hiding admin links is not sufficient.
- Supabase Auth protects identity and sessions; MongoDB queries must scope profiles, carts, addresses, orders, wishlists, and reviews by authenticated user ID.
- Razorpay payments must be signature-verified server-side and reconciled through a verified webhook.
- Never store raw card data.
- Checkout requires a Supabase-authenticated user with a verified phone number; the server compares the checkout phone with `user.phone` before creating a payment order.
- RLS is mandatory for every Supabase table, storage policy, view, or RPC we create. See `supabase/RLS_RULES.md`.
- The Supabase MCP configuration is in `.vscode/mcp.json`; it requires a separate Supabase personal access token and must not use the publishable key as a management credential.

## Environment Variables

See `.env.example`. Expected values include:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `EMAIL_FROM`
- `RESEND_API_KEY`
- `NEXT_PUBLIC_SENTRY_DSN`

## Next Work Order

1. Fill `.env.local` with real MongoDB and Supabase project values.
2. Run the MongoDB seed and replace sample catalog reads with MongoDB queries and Supabase Storage image URLs.
3. Connect cart persistence, checkout server actions, and coupon/order calculations to the database.
4. Add Razorpay order creation, signature verification, and webhook processing.
5. Complete admin CRUD mutations and customer order/review mutations.
6. Add automated unit, integration, and end-to-end tests for auth, cart, checkout, payment, and admin authorization.

Razorpay routes are implemented but remain disabled until real `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, and `RAZORPAY_WEBHOOK_SECRET` values replace the placeholders in `.env.local`.

## Working Rules

- Keep changes incremental and focused.
- Prefer Server Components; use Client Components only for interaction.
- Preserve the existing visual language when adding routes.
- Do not invent business claims, reviews, stock, delivery promises, or payment confirmations.
- Do not commit `.env.local` or any real secret.
- Update this file after major architectural or product decisions.

## Current State: 2026-10-02

### Architecture

- Keep the project on Next.js. It is already a React application; do not migrate it to a separate React/Vite app.
- The runtime remains hybrid for now: Supabase handles identity/session management and MongoDB stores catalog, addresses, profiles, orders, coupons, and inventory.
- A future Supabase-only data migration was discussed as a simplification option, but it has not been implemented. Do not remove MongoDB code until that migration is deliberately planned and verified.

### Route Organization

- Route groups now organize the App Router source without changing public URLs:
  - `src/app/(store)/`: homepage, catalog, categories, search, cart, checkout, wishlist, order success.
  - `src/app/(account)/`: login, auth callback, account, and unauthorized pages.
  - `src/app/(admin)/admin/`: protected admin pages.
  - `src/app/api/`: server endpoints.
- See `ARCHITECTURE.md` for the current source-tree map.
- `.kilo/worktrees/basalt-epoxy` is a separate/incomplete worktree. Run the application from the repository root, not that worktree.

### Storefront And UI

- The local catalog now contains eight sample products with public Unsplash images and INR prices in `src/lib/products.ts`.
- Catalog reads merge MongoDB records with matching local image fallbacks. This prevents legacy MongoDB products with missing/broken image paths from rendering as empty cards.
- Product listings have add-to-bag actions, homepage navigation uses real app routes, and cart checkout navigates to `/checkout`.
- Cart, checkout address selection, and order-summary layout received responsive styling fixes. Continue visual verification across desktop and mobile after each UI change.

### Checkout And Development Behavior

- Checkout recalculates product/price/stock server-side from MongoDB and keeps Razorpay order creation/signature verification on the server.
- In development only, checkout can upsert a missing local sample product into MongoDB before creating an order. This exists to keep the demo checkout usable before a full MongoDB seed; production still rejects unavailable products.
- The checkout mobile-verification modal preserves the real Supabase phone-change flow: `updateUser({ phone })` followed by `verifyOtp(..., type: "phone_change")`.
- A verified phone is stored on the Supabase Auth user and is reused for later purchases. Checkout asks again only when the signed-in user has no verified phone; an expired or missing session redirects the user to login.
- `DEV_BYPASS_PHONE_OTP` is currently `true` for local development because Supabase still reports that no SMS provider is configured. Set it to `false` only after Twilio is configured in the Supabase Dashboard; never enable it in production.
- When real OTP is used, the Supabase Dashboard Phone provider must be enabled and configured with the Twilio credentials. The client app does not read Twilio credentials directly.
- Checkout address phone must match the verified Supabase phone number.

### Razorpay Test Checkout Flow

- Checkout creates a server-side Razorpay test order at `/api/checkout/create-order`.
- The Razorpay browser handler sends `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature` to `/api/payments/verify`.
- The server verifies the HMAC signature, requires the signed-in user to own the MongoDB order, and checks that the callback amount matches the order total before marking it `paid` and `confirmed`.
- Only after successful server verification does the client clear the cart and redirect to `/order-success?order=...`.
- The order-success screen calls `/api/orders/[id]` and shows the confirmation UI only when the backend reports `paymentStatus: paid`; otherwise it shows a pending state.
- Configure Razorpay Dashboard webhooks to call `/api/webhooks/razorpay` with `payment.captured`, `payment.failed`, and `order.paid` events. Keep the webhook secret server-only.

### Environment Status

- Supabase public configuration, MongoDB configuration, Razorpay configuration, SMTP configuration, and Twilio configuration are present in `.env.local`.
- `SUPABASE_SERVICE_ROLE_KEY` is still a placeholder. It is not required by the current customer checkout/auth flow, but must be set before using any server-side Supabase admin features.
- `RESEND_API_KEY` is still a placeholder. SMTP is configured separately; transactional email implementation is not complete.
- Never record actual environment values or secrets in this file.

### Verification Notes

- `git diff --check` has passed during recent changes.
- Local lint/build checks have been unreliable in the current cross-platform workspace because the installed `node_modules` binaries and temporary-cache paths do not match the execution environment. Run final lint/build from the same Windows environment used to run the app.
