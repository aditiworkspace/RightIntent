# Build Aditi — Production-Ready E-Commerce Website

You are a senior full-stack engineer and software architect.

I want you to build a **complete, production-ready e-commerce website called "Aditi"** from scratch.

The website will be used to sell physical products online.

The goal is to create a website that is:

* Fast
* Secure
* Reliable
* SEO-friendly
* Mobile responsive
* Accessible
* Scalable
* Easy to maintain
* Production-ready
* Modern in UI/UX

Do not create a simple demo or prototype. Build the application with production-quality architecture and code.

---

# 1. Technology Stack

Use the following stack.

## Frontend

* Next.js — latest stable version
* React
* TypeScript
* App Router
* Tailwind CSS
* shadcn/ui
* Radix UI where appropriate

Do NOT use plain JavaScript unless absolutely necessary.

Use TypeScript throughout the project.

---

# 2. Backend Architecture

Do NOT create a separate Express.js backend initially.

Use Next.js's built-in backend capabilities:

* Server Components
* Server Actions
* Route Handlers
* Middleware where appropriate

The architecture should look like:

```text
Next.js
 ├── Server Components
 ├── Server Actions
 ├── Route Handlers
 └── Middleware
          │
          ▼
      Supabase
```

Keep the architecture simple and avoid unnecessary services.

If a separate backend becomes genuinely necessary later, structure the code so it can be extracted without major rewriting.

---

# 3. Database

Use:

**Supabase PostgreSQL**

Do NOT use MongoDB unless there is a strong technical reason.

The database should contain properly normalized relational data.

Main entities should include:

```text
users
products
categories
product_images
product_variants
inventory
cart
cart_items
addresses
orders
order_items
payments
coupons
coupon_usage
reviews
wishlists
```

You may introduce additional tables if required.

Use proper:

* Primary keys
* Foreign keys
* Unique constraints
* Indexes
* Timestamps
* Check constraints where appropriate

Design the database for scalability and data integrity.

---

# 4. Authentication

Use:

**Supabase Auth**

Support:

### Email authentication

* Sign up
* Login
* Logout
* Email verification
* Forgot password
* Reset password
* Session management

### Google authentication

Add:

```text
Continue with Google
```

using Supabase OAuth.

Authentication must be secure.

Never expose:

* Supabase service-role keys
* Payment secrets
* API secrets
* Private environment variables

to the browser.

---

# 5. User Roles

Implement role-based access control.

At minimum:

```text
customer
admin
```

Users must never be able to make themselves admin from the frontend.

Admin authorization must be verified server-side.

Do not rely only on hiding `/admin`.

---

# 6. Admin Panel

Create a protected admin dashboard at:

```text
/admin
```

If the user is not authenticated:

```text
/admin → /login
```

If authenticated but not an admin:

```text
/admin → 403 / Unauthorized
```

Admin dashboard should include:

```text
/admin
/admin/products
/admin/products/new
/admin/products/[id]
/admin/categories
/admin/orders
/admin/orders/[id]
/admin/customers
/admin/coupons
/admin/reviews
/admin/inventory
/admin/settings
```

---

# 7. Admin Features

The admin should be able to:

## Products

* Create product
* Edit product
* Delete product
* Publish/unpublish product
* Change price
* Change sale price
* Upload product images
* Manage product variants
* Manage SKU
* Manage stock
* Assign categories
* Add product description
* Add product specifications

## Categories

* Create category
* Edit category
* Delete category
* Enable/disable category

## Orders

Admin should be able to:

* View orders
* Search orders
* Filter orders
* View order details
* Update order status
* View payment status
* View customer details
* View shipping address
* Process appropriate order actions

Order statuses should support something similar to:

```text
pending
confirmed
processing
shipped
delivered
cancelled
refunded
```

## Inventory

Admin should be able to:

* View stock
* Update stock
* See low-stock products
* Track SKU
* Manage product variants

## Coupons

Admin should be able to:

* Create coupon
* Set discount percentage
* Set fixed discount
* Set expiry
* Set usage limit
* Enable/disable coupon
* Set minimum order amount

---

# 8. Product Storefront

Create a beautiful customer-facing storefront.

Pages should include:

```text
/
 /products
 /products/[slug]
 /category/[slug]
 /search
 /cart
 /checkout
 /order-success
 /account
 /account/orders
 /account/orders/[id]
 /account/profile
 /account/addresses
 /wishlist
```

---

# 9. Homepage

The homepage should have a premium modern e-commerce design.

Include sections such as:

* Header
* Navigation
* Hero section
* Featured products
* Categories
* Best sellers
* New arrivals
* Promotional section
* Product benefits
* Customer reviews
* FAQ
* Newsletter
* Footer

Do not make the design generic.

Use clean spacing, modern typography, good visual hierarchy, subtle animations and a premium shopping experience.

The final design should feel like a real commercial brand rather than a developer portfolio.

---

# 10. Header

Header should contain:

* Logo / Aditi branding
* Home
* Products
* Categories
* Search
* Wishlist
* Cart
* Login / Account

On mobile:

* Hamburger menu
* Search
* Cart
* Account

Keep the header responsive.

---

# 11. Product Listing

Product listing pages should support:

* Search
* Category filtering
* Price filtering
* Sorting
* Pagination or infinite loading
* Product cards
* Sale badges
* Stock status
* Wishlist button

Product card should show:

* Product image
* Product name
* Price
* Original price if discounted
* Discount
* Rating
* Wishlist button
* Add to cart

---

# 12. Product Details

Product detail page should include:

* Multiple product images
* Image gallery
* Product name
* Price
* Discount price
* Product description
* Specifications
* Stock status
* Quantity selector
* Add to cart
* Buy now
* Wishlist
* Reviews
* Related products

If the product has variants, support:

```text
Size
Color
Weight
etc.
```

depending on the actual product.

---

# 13. Cart

Implement a complete shopping cart.

Features:

* Add product
* Remove product
* Increase quantity
* Decrease quantity
* Update quantity
* Product subtotal
* Discount
* Shipping
* Tax if applicable
* Final total

Cart should remain available across page navigation.

For authenticated users, persist the cart.

If useful, support guest cart → authenticated user cart merging after login.

---

# 14. Checkout

Create a clean multi-step or single-page checkout.

Collect:

```text
Customer information
Shipping address
Billing address if required
Order summary
Coupon
Payment method
```

Before payment, calculate the final amount server-side.

Never trust price or total values sent from the client.

---

# 15. Payment Gateway

Use:

**Razorpay**

for Indian payments unless the project requirements later require another provider.

Integrate Razorpay securely.

Payment flow:

```text
Customer
   ↓
Checkout
   ↓
Create order on server
   ↓
Create Razorpay order
   ↓
Open Razorpay Checkout
   ↓
Customer completes payment
   ↓
Payment verification
   ↓
Razorpay webhook
   ↓
Verify server-side
   ↓
Update payment status
   ↓
Update order
```

IMPORTANT:

Never mark an order as paid based solely on frontend information.

Verify payment server-side.

Use Razorpay webhooks where appropriate.

Store payment-related identifiers securely.

Never store raw card information.

---

# 16. Payment Configuration

Use environment variables.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

Never commit `.env` files.

Create:

```text
.env.example
```

with placeholder values.

---

# 17. Image Storage

Use:

**Supabase Storage**

for product images unless there is a strong reason to use another CDN.

Do not store large image files directly in PostgreSQL.

Store image metadata/path in the database.

Use:

```text
Next.js Image
```

for optimized image delivery wherever appropriate.

Images should be:

* Responsive
* Optimized
* Lazy-loaded where appropriate
* Properly sized
* Given meaningful alt text

---

# 18. SEO

SEO is important because this is an e-commerce website.

Implement:

* Metadata
* Dynamic page titles
* Meta descriptions
* Canonical URLs
* Open Graph metadata
* Twitter/X metadata where appropriate
* Sitemap
* Robots.txt
* Structured data
* Product schema
* Breadcrumb schema where appropriate

Product pages should be SEO-friendly.

Use clean URLs:

```text
/products/product-name
```

instead of:

```text
/product?id=123
```

---

# 19. Performance

Optimize the website aggressively.

Use:

* Server Components wherever appropriate
* Static generation/revalidation where appropriate
* Dynamic rendering only when necessary
* Next/Image
* Lazy loading
* Code splitting
* Proper caching
* Database indexes
* Efficient queries
* Pagination
* Minimal client-side JavaScript

Do not turn every component into a Client Component.

Use Client Components only when interactivity requires them.

Target excellent Core Web Vitals.

---

# 20. State Management

Do not introduce a large state-management library unnecessarily.

Use:

**Zustand**

primarily for client-side UI state such as:

* Cart state
* Wishlist state if necessary
* UI state

Use server/database state from the server rather than duplicating everything into global client state.

For complex server-state requirements, TanStack Query can be introduced where it provides a clear benefit.

---

# 21. Forms and Validation

Use:

**React Hook Form + Zod**

for forms.

Validate data on both:

* Client
* Server

Never rely only on client-side validation.

Important forms include:

* Login
* Registration
* Address
* Checkout
* Product creation
* Product editing
* Coupon creation
* Admin settings

---

# 22. Security

Treat security as a first-class requirement.

Implement:

* Server-side authorization
* Role-based access control
* Input validation
* SQL injection protection through parameterized queries / Supabase APIs
* CSRF considerations
* XSS protection
* Secure cookies/session handling
* Rate limiting where appropriate
* Secure headers
* Proper CORS configuration if required
* Secret management
* Webhook signature verification
* Payment verification
* Server-side price validation

Never trust:

```text
price
discount
role
userId
paymentStatus
orderTotal
```

sent from the client.

---

# 23. Database Security

Use Supabase Row Level Security where appropriate.

Customers should only be able to access their own:

```text
profile
orders
addresses
cart
wishlist
reviews
```

Admins can access appropriate administrative data through secure server-side authorization.

Do not expose unrestricted database access to the browser.

---

# 24. Error Handling

Implement proper error handling.

Create:

* Loading states
* Error states
* Empty states
* 404 pages
* Unauthorized page
* Forbidden page
* Global error boundary
* API error handling
* Payment failure handling

Do not expose sensitive server errors to users.

---

# 25. UX Requirements

The application must be:

* Mobile-first
* Responsive
* Accessible
* Keyboard navigable
* Touch friendly
* Fast

Include appropriate:

* Skeleton loaders
* Toast notifications
* Confirmation dialogs
* Empty states
* Form validation messages
* Loading indicators

Avoid excessive animations.

Animations should improve UX rather than slow the website down.

---

# 26. Accessibility

Follow good accessibility practices.

Use:

* Semantic HTML
* Proper labels
* Keyboard navigation
* Focus states
* ARIA only when necessary
* Accessible dialogs
* Accessible buttons
* Meaningful alt text
* Sufficient contrast

---

# 27. Folder Structure

Use a clean scalable structure similar to:

```text
src/
├── app/
│   ├── (store)/
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── category/
│   │   ├── search/
│   │   ├── cart/
│   │   ├── checkout/
│   │   └── account/
│   │
│   ├── admin/
│   │   ├── page.tsx
│   │   ├── products/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── categories/
│   │   ├── coupons/
│   │   └── settings/
│   │
│   ├── auth/
│   ├── api/
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── error.tsx
│
├── components/
│   ├── ui/
│   ├── layout/
│   ├── products/
│   ├── cart/
│   ├── checkout/
│   ├── admin/
│   └── auth/
│
├── lib/
│   ├── supabase/
│   ├── razorpay/
│   ├── auth/
│   ├── db/
│   ├── validation/
│   └── utils/
│
├── actions/
├── types/
├── hooks/
└── config/
```

Adjust the structure when the project grows, but keep responsibilities clearly separated.

---

# 28. Code Quality

Follow these rules:

* TypeScript strict mode
* No unnecessary `any`
* Reusable components
* Small focused functions
* Clear naming
* No duplicated business logic
* No hardcoded secrets
* No unnecessary dependencies
* Proper error handling
* Proper loading states
* Comments only when they add meaningful context

Do not generate huge monolithic components.

---

# 29. Environment

The project should be easy to run locally.

Provide:

```text
README.md
.env.example
```

README should explain:

1. Requirements
2. Installation
3. Environment variables
4. Supabase setup
5. Database setup
6. Google OAuth setup
7. Razorpay setup
8. Local development
9. Production deployment
10. Admin setup

---

# 30. Seed Data

Create a seed mechanism for development.

It should create:

* Sample categories
* Sample products
* Sample product images/placeholders
* Sample admin user instructions

Do NOT hardcode production credentials.

---

# 31. Testing

Add tests for important business logic.

At minimum test:

* Authentication logic
* Product validation
* Cart calculations
* Coupon calculations
* Order calculations
* Payment verification
* Admin authorization

Also include appropriate integration/end-to-end tests for critical flows:

```text
Register
Login
Google login
Add to cart
Checkout
Payment
Order creation
Admin product creation
Admin order management
```

---

# 32. Logging and Monitoring

Structure the application so production monitoring can be added easily.

Do not log:

* Passwords
* Payment secrets
* Authentication tokens
* Sensitive customer information

Log useful technical information such as:

* Errors
* Failed payment verification
* Failed webhook
* Important server failures

---

# 33. Deployment

Target deployment:

```text
Frontend + Backend
        ↓
      Vercel

Database + Auth + Storage
        ↓
     Supabase

Payments
        ↓
     Razorpay
```

Make sure the application works correctly in production and does not depend on localhost behavior.

---

# 34. Important Architecture Rule

Do not blindly implement every technology mentioned in this prompt.

The priority order is:

```text
Security
   ↓
Correctness
   ↓
Reliability
   ↓
Performance
   ↓
Scalability
   ↓
Developer experience
```

If a technology makes the architecture unnecessarily complicated without providing a meaningful benefit, don't use it.

For example:

Do NOT add:

```text
Express
MongoDB
Redis
Kafka
microservices
Docker
Kubernetes
```

just because they are popular.

Introduce additional infrastructure only when there is a real requirement.

---

# 35. Development Process

Do NOT try to generate the entire application in one giant response.

Build it incrementally.

Follow this order:

### Phase 1 — Foundation

* Initialize Next.js
* Configure TypeScript
* Configure Tailwind
* Configure shadcn/ui
* Configure project structure
* Configure environment variables

### Phase 2 — Database

* Design schema
* Create migrations
* Add indexes
* Configure RLS
* Create seed data

### Phase 3 — Authentication

* Supabase Auth
* Email/password
* Google OAuth
* Session management
* Protected routes
* Admin authorization

### Phase 4 — Storefront

* Header
* Footer
* Homepage
* Product listing
* Product details
* Search
* Categories

### Phase 5 — Cart

* Add to cart
* Remove
* Quantity
* Persistence
* Guest cart
* User cart

### Phase 6 — Checkout

* Address
* Order summary
* Coupon
* Price calculation
* Shipping
* Tax if applicable

### Phase 7 — Payments

* Razorpay integration
* Order creation
* Payment verification
* Webhooks
* Payment status

### Phase 8 — Orders

* Customer order history
* Order details
* Order status
* Admin order management

### Phase 9 — Admin

* Dashboard
* Products
* Categories
* Inventory
* Orders
* Customers
* Coupons
* Reviews

### Phase 10 — SEO & Performance

* Metadata
* Sitemap
* Robots
* Structured data
* Image optimization
* Caching
* Performance optimization

### Phase 11 — Testing

* Unit tests
* Integration tests
* E2E tests

### Phase 12 — Production

* Security review
* Environment configuration
* Deployment
* Production testing

---

# 36. Design Direction

The website should look like a **real premium Indian e-commerce brand**.

Do not create a generic template with:

* excessive gradients
* unnecessary glassmorphism
* random animations
* huge rounded cards everywhere
* meaningless dashboard charts

Use:

* strong typography
* clean layouts
* good whitespace
* consistent spacing
* high-quality product imagery
* clear CTAs
* subtle interactions
* responsive design
* strong visual hierarchy

The exact colors, typography and visual identity should be selected based on the actual products and brand identity.

---

# 37. Critical Business Logic Rules

Always calculate important values server-side.

For example:

```text
Client:
quantity = 3

Server:
fetch product
fetch current price
verify stock
calculate subtotal
apply valid coupon
calculate shipping
calculate tax
calculate final amount
create order
```

Never trust:

```text
clientPrice
clientDiscount
clientTotal
clientRole
clientPaymentStatus
```

---

# 38. Final Requirement

Before considering the project complete, verify:

* Authentication works
* Google login works
* Admin authentication works
* Customers cannot access admin functionality
* Product CRUD works
* Inventory works
* Cart works
* Checkout works
* Coupon system works
* Razorpay payment works
* Webhook verification works
* Orders are created correctly
* Customers can view their orders
* Admin can manage orders
* Images upload correctly
* Mobile UI works
* SEO works
* Error handling works
* Security rules are enforced
* Production environment variables are separated
* No secrets are committed
* No unnecessary dependencies/services are used

Build the project with clean, maintainable, production-quality code.

When making architectural decisions, explain the decision briefly before implementing it, especially if you deviate from the requested architecture.

Do not skip security or payment verification for the sake of making the implementation simpler.
