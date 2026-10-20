# Aditi

A premium Indian e-commerce storefront built with Next.js, TypeScript, Tailwind CSS, Supabase Auth, and MongoDB.

`New RTF Text.md` is the primary product and feature specification. Supabase provides Auth, OAuth sessions, Storage, and the product catalog. Each `public.products` row stores the product details, subcategory, stock, image metadata, and variant data; `categories` remains a lookup table, while image files remain in the `product-images` Storage bucket. Row Level Security protects the product table.

## Run locally

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Storefront product pages and the admin catalog read product data from the same Supabase row; image files are stored in Supabase Storage and their metadata is kept on that row.

Development uses Webpack instead of Turbopack to avoid recurring Windows `EPERM` errors when Turbopack replaces generated server manifests.

## Environment

The project includes a local placeholder file at `.env.local` and a shareable template at `.env.example`. Replace the placeholders in `.env.local` before connecting services. Keep `MONGODB_URI`, `SUPABASE_SERVICE_ROLE_KEY`, Razorpay secrets, webhook secrets, and email provider keys server-only. `.env.local` is ignored by Git.

Provider setup instructions for Supabase email/Gmail OTP, phone SMS OTP, Google OAuth, and Razorpay are in [PROVIDER_SETUP.md](PROVIDER_SETUP.md).

## Next implementation phases

1. Seed and manage product catalog rows through Supabase.
2. Keep Supabase Auth and server-side admin authorization.
3. Move catalog reads and cart mutations into Server Actions.
4. Add Razorpay order creation, signature verification, and webhook handling.
5. Continue refining product, order, inventory, review, and customer admin screens.

## Commands

```bash
npm run lint
npm run build
npm run seed:mongodb
npm run db:indexes
```

Run `npm run seed:mongodb` only after setting a real `MONGODB_URI`. Run `npm run db:indexes` once when deploying the catalog, address, and order index changes. Supabase Auth remains required for login, OAuth, and session cookies; MongoDB stores application records and roles.

Catalog results are cached for 60 seconds and invalidated after an admin creates a product. API handlers emit structured performance records to the server log with request ID, endpoint, status, total duration, MongoDB duration/query count, authentication duration/check count, external-service duration/request count, response size, and error status. Address APIs verify the signed Supabase access-token claims rather than fetching the full user record. With asymmetric Supabase signing keys this is usually verified locally; symmetric signing keys still require server-side verification. Use production records to calculate rolling P50/P95/P99; local development timings include compilation and do not represent production latency.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
