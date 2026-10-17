@AGENTS.md

---

# Project Memory — Right Intent Storefront

> Last updated: October 2026 (Session 2)

## Project Overview

**Brand**: Right Intent — luxury journals, planners, and intentional living tools
**Stack**: Next.js 16.3.7 (Turbopack/Webpack), TypeScript, Tailwind CSS, Supabase (`@supabase/ssr`), Twilio (via Supabase Phone Auth)
**Root**: `c:\Users\hp\Desktop\Simple`
**Build status**: ✅ All 48 routes pass (`npm run build`)

---

## Critical Rules (Always Follow)

- **Never modify the home page** — `src/app/(store)/page.tsx` and all `src/components/store/home/**` files are frozen
- **Never modify** `src/app/(store)/search/page.tsx`
- Middleware file is `src/proxy.ts` (NOT `middleware.ts`) — exports `proxy` as default and `config`
- Supabase uses `getClaims()` (not `getUser()`) for JWT claim extraction
- CSS tokens: `--ink`, `--paper`, `--cream`, `--terra`, `--muted`, `--line`, `--serif`, `--mono`, `--sans`
- All UI must follow the luxury editorial aesthetic matching the brand

---

## Architecture & File Map

### Supabase Client Helpers
| File | Purpose |
|------|---------|
| `src/lib/supabase/browser.ts` | Browser client — `AUTH_COOKIE_MAX_AGE = 2419200` (28 days), `cookieOptions` set |
| `src/lib/supabase/server.ts` | Server/RSC client — applies `AUTH_COOKIE_MAX_AGE` to all `setAll` cookie writes |
| `src/proxy.ts` | Middleware — global matcher, session refresh, cookie persistence |

### Global Styles
- `src/app/globals.css` — luxury utility classes added:
  `.luxury-card`, `.luxury-badge`, `.badge-terracotta`, `.badge-ink`, `.badge-outline`,
  `.editorial-chip`, `.editorial-btn`, `.editorial-btn-primary`, `.editorial-btn-secondary`, `.editorial-input`

### Core Shared Components
| File | Notes |
|------|-------|
| `src/components/store/route-page.tsx` | `RoutePage` (editorial layout, pill breadcrumbs) + `RouteNav` (sticky blur header) |
| `src/components/store/product-tile.tsx` | Luxury card with hover zoom, inventory badges, `ContinueLink` export |
| `src/components/store/product-detail-client.tsx` | **New** — interactive PDP client (tab accordion, gallery, wishlist toggle, trust badges) |
| `src/components/store/add-to-cart-button.tsx` | Unchanged |
| `src/components/account/logout-button.tsx` | **New** — `LogoutButton` with `supabase.auth.signOut()` + loading state |
| `src/components/account/address-manager.tsx` | Grid address cards, default badge, collapsible add form |
| `src/components/account/profile-form.tsx` | Editorial input layout with metadata |
| `src/components/admin/admin-page.tsx` | `AdminPage` header + `AdminTable` as `<table>` with hover rows |

### Store Pages
| Route | File |
|-------|------|
| `/products` | `src/app/(store)/products/page.tsx` — category pill filter + sort + 3-col grid |
| `/category/[slug]` | `src/app/(store)/category/[slug]/page.tsx` — back nav + count + 3-col grid |
| `/products/[slug]` | `src/app/(store)/products/[slug]/page.tsx` — uses `ProductDetailClient`, SSG |
| `/cart` | `src/app/(store)/cart/page.tsx` — 2-col bag, free shipping bar, sticky order summary |
| `/checkout` | `src/app/(store)/checkout/page.tsx` — 3-step (Contact → Address → Promo), phone verify modal |
| `/order-success` | `src/app/(store)/order-success/page.tsx` — receipt card + next steps |
| `/wishlist` | `src/app/(store)/wishlist/page.tsx` — branded empty state |

### Account Pages
| Route | File |
|-------|------|
| `/account` | `src/app/(account)/account/page.tsx` — dashboard, user status, `LogoutButton`, 4 nav tiles |
| `/account/orders` | `src/app/(account)/account/orders/page.tsx` — order cards with status chips |
| `/account/orders/[id]` | `src/app/(account)/account/orders/[id]/page.tsx` — 4-step milestone timeline |
| `/account/addresses` | `src/app/(account)/account/addresses/page.tsx` — uses `AddressManager` |
| `/account/profile` | `src/app/(account)/account/profile/page.tsx` — uses `ProfileForm` |

### Admin Pages
| Route | File |
|-------|------|
| `/admin` | layout: sidebar with icon nav; page: KPI cards (Revenue/Orders/Products/Low Stock) |
| `/admin/categories`, `/orders`, `/inventory`, `/coupons`, `/customers`, `/reviews`, `/settings` | Use upgraded `AdminPage`/`AdminTable` |

---

## Authentication System

### 28-Day Session Persistence
- `cookieOptions.maxAge = 2419200` applied in browser client, server client, and middleware
- Users stay logged in for 28 days without re-entering OTP (unless they manually log out)

### Login Page — `src/app/(account)/login/page.tsx`
- **Mode toggle**: Mobile (Phone) / Email segmented tabs
- **Phone**: E.164 normalization → `+91XXXXXXXXXX`; `{ options: { channel: "sms" } }` forces Twilio SMS routing
- **Email**: Magic link via `supabase.auth.signInWithOtp({ email })`
- **OTP verify**: `supabase.auth.verifyOtp({ phone/email, token, type: "sms"/"email" })`
- **OTP resend**: 30-second cooldown timer
- **Google OAuth**: Official 4-color Google SVG, `access_type: "offline"`, `prompt: "consent"`, loading state
- **Hydration fix**: `mounted` state guard — SSR renders spinner; interactive form renders only after `useEffect`
- **`suppressHydrationWarning`** on `<main>`, outer `<div>`, identifier `<input>`, OTP `<input>`

### Checkout Phone Verification
- Uses `supabase.auth.updateUser({ phone })` + `verifyOtp({ type: "phone_change" })`

### Twilio SMS Setup (Manual — Not In Code)
Twilio credentials must be configured in:
> **Supabase Dashboard → Authentication → Providers → Phone**
> Fields: Account SID, Auth Token, Message Service SID

Dev bypass: `DEV_BYPASS_PHONE_OTP=true` in `.env.local` + cookie `aditi-dev-phone` + OTP code `123456`

### Google OAuth Setup (Manual — Not In Code)
1. Google Cloud Console → OAuth 2.0 credentials → add redirect URI: `https://<project>.supabase.co/auth/v1/callback`
2. Supabase Dashboard → Authentication → Providers → Google → paste Client ID + Secret

---

## Hydration Mismatch Patterns & Fixes

### Problem
Browser extension (`rtrvr-ls`, `rtrvr-ro` attributes) injects attributes into DOM before React hydrates, causing mismatches.

### Solutions Applied
| Element | Fix |
|---------|-----|
| `<body>` in `src/app/layout.tsx` | `suppressHydrationWarning` |
| Login `<main>`, `<div>`, `<input>` | `suppressHydrationWarning` |
| Login `<form>` + dynamic content | `mounted` state guard (`useEffect` sets `mounted = true`; SSR returns spinner) |

### Pattern: `mounted` guard
```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
if (!mounted) return <div className="min-h-screen" />;
// render full interactive UI
```

### Anti-pattern (causes hydration mismatch)
```tsx
// ❌ Never do this for SSR-sensitive values
const path = typeof window !== "undefined" ? window.location.search : "";
```

---

## Environment Variables (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEV_BYPASS_PHONE_OTP=true   # remove in production
```

---

## Known Issues / TODO

- [ ] Twilio SMS: Credentials not yet added to Supabase Dashboard (user action required)
- [ ] Google OAuth: Client ID/Secret not yet added to Supabase Dashboard (user action required)
- [ ] Checkout phone verification: Tested via dev bypass only; needs Twilio in production
- [ ] Wishlist persistence: Currently UI-only — needs Supabase table + RLS policy
- [ ] Order tracking: Milestone timeline is static mock — needs real order status from DB

---

## Session History

### Session 1 (Initial Setup)
- Project scaffolded with Next.js 16, Supabase auth, product catalog, cart, admin

### Session 2 (UI Architecture + Auth + Clean Dev Configuration)
- Full non-home UI rewrite to luxury editorial aesthetic (48 routes)
- 28-day session persistence via cookie `maxAge` and proxy middleware
- Complete Google OAuth PKCE callback handler at `src/app/(account)/auth/callback/route.ts`
- Hydration mismatches fixed (`suppressHydrationWarning` + `mounted` guard pattern)
- Standardized `next.config.ts`: removed problematic development `distDir: .next-dev-portal`
- Standardized `package.json` dev script to native `next dev` (Turbopack)
- Scoped Tailwind v4 in `src/app/globals.css` with `@source "../**/*.{ts,tsx,js,jsx}"` to prevent indexing workspace root or lock files
- Ignored `.next*` variants in `.gitignore`
- All 48 routes verified passing production build (`npm run build`)
