# Aditi code map

The app keeps the existing URLs while using Next.js route groups to make the source tree easier to scan. Parentheses in a folder name are organizational only and do not appear in browser URLs.

## App routes

```text
src/app/
  (store)/                 Public shopping experience
    page.tsx               Homepage (/)
    products/              Catalog and product details (/products)
    category/              Category pages (/category/...)
    search/                Product search (/search)
    cart/                  Shopping cart (/cart)
    checkout/              Checkout (/checkout)
    wishlist/              Saved products (/wishlist)
    order-success/         Payment success (/order-success)
  (account)/               Customer identity and account pages
    login/                 Email, phone, and Google login (/login)
    auth/callback/         Supabase OAuth and magic-link callback (/auth/callback)
    account/               Profile, addresses, and orders (/account/...)
    unauthorized/          Access denied page (/unauthorized)
  (admin)/admin/           Protected admin dashboard (/admin/...)
  api/                     Server endpoints and mutations (/api/...)
  layout.tsx               Root metadata and global CSS
  globals.css              Shared visual system
  error.tsx                Route error boundary
  loading.tsx               Shared loading UI
  not-found.tsx             404 page
```

## Shared code

```text
src/components/
  store/                    Store navigation, product tiles, cart actions
  account/                  Account forms and address UI
  admin/                    Admin tables and forms
src/lib/
  catalog.ts                Catalog reads and sample-image fallback
  products.ts               Local sample catalog and image URLs
  cart-store.ts              Client-side cart state
  supabase/                 Browser/server Supabase clients
  auth/                     Current-user/profile helpers
  models.ts                 MongoDB models (legacy migration target)
  mongodb.ts                MongoDB connection (legacy migration target)
```

## Where to make common changes

- Add a public page under `src/app/(store)/`.
- Add an account page under `src/app/(account)/account/`.
- Add an API mutation under `src/app/api/`.
- Add reusable UI under the matching `src/components/` folder.
- Add catalog data or image fallback in `src/lib/products.ts` and `src/lib/catalog.ts`.
- Keep secrets in `.env.local`; never put server-only keys in client components.
