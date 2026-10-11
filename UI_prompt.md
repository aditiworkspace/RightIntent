# Aditi E-Commerce Website — Premium UI/UX Development Prompt

You are a senior UI/UX designer, creative frontend engineer, and motion designer.

We are building **Aditi**, a premium e-commerce website for selling physical products online.

The objective of this task is **not to change the application's backend architecture or business logic**.

Your primary responsibility is to transform the existing storefront into a **high-end, visually attractive, modern, premium shopping experience** that makes customers want to explore the products and purchase them.

The website should feel like a **real established consumer brand**, not a generic developer-built e-commerce template.

---

# 1. First Understand the Product

Before designing the UI, inspect:

* Product images
* Product names
* Product descriptions
* Product category
* Product colors
* Product packaging
* Existing brand assets
* Logo
* Any available product videos
* Existing content in the project

Do **not invent a visual identity blindly**.

The product itself should be the primary inspiration for:

* Color palette
* Typography
* Card style
* Photography treatment
* Background colors
* Accent colors
* Animation style
* CTA design
* Overall visual mood

If product images are available, make them the visual centerpiece of the website.

The UI should enhance the product rather than compete with it.

---

# 2. Overall Design Goal

Create a:

**Modern + Premium + Attractive + Trustworthy + Conversion-focused**

e-commerce experience.

The design should immediately communicate:

```text
Premium product
        +
Trust
        +
Quality
        +
Modern brand
        +
Easy shopping
```

Avoid making the website look like a basic Shopify clone.

Avoid generic templates.

Avoid excessive visual effects.

The design should be visually impressive but still professional.

---

# 3. Visual Design Language

Use a modern design system with:

* Large visual sections
* Strong typography
* Generous whitespace
* Premium product photography
* Layered cards
* Soft shadows
* Subtle gradients
* Carefully controlled borders
* Smooth transitions
* Micro-interactions
* Modern buttons
* Elegant hover effects

Use visual hierarchy to guide the customer's eyes toward:

```text
Product
   ↓
Value
   ↓
Trust
   ↓
CTA
```

---

# 4. Theme Colors

Do not randomly select colors.

First extract the dominant visual characteristics of the actual product and create a brand palette around them.

Create a design-token system such as:

```text
Primary
Primary foreground
Secondary
Accent
Background
Surface
Card
Border
Muted
Success
Warning
Error
```

Example structure:

```css
--primary
--primary-foreground
--secondary
--accent
--background
--foreground
--card
--card-foreground
--muted
--muted-foreground
--border
--success
--warning
--destructive
```

The exact colors should be determined from the product/brand.

Prefer a restrained palette.

Do not use 10–15 competing colors.

---

# 5. Premium Color Treatment

Use color strategically.

For example:

```text
Background
     ↓
Neutral / brand-inspired

Cards
     ↓
Slightly contrasting surface

Primary CTA
     ↓
Strong brand color

Secondary CTA
     ↓
Subtle outline / muted style

Discount
     ↓
Controlled accent

Success
     ↓
Green

Error
     ↓
Red
```

Don't turn the entire website into a gradient.

Gradients should be used only where they genuinely improve the design.

---

# 6. Typography

Typography is extremely important.

Use a modern professional font combination.

Possible direction:

```text
Heading:
Modern geometric / editorial font

Body:
Clean highly readable sans-serif
```

Create a proper type scale:

```text
Display
H1
H2
H3
H4
Body Large
Body
Body Small
Caption
```

Large headings should feel premium.

Avoid excessively bold typography everywhere.

Use font weight to create hierarchy.

---

# 7. Homepage

The homepage should be the strongest visual part of the website.

The first screen should immediately communicate:

1. What Aditi sells
2. Why the product is valuable
3. Why the customer should care
4. Where the customer should click

---

# 8. Hero Section

Create a premium hero section.

Use:

```text
Large product visual
        +
Strong headline
        +
Short supporting message
        +
Primary CTA
        +
Secondary CTA if appropriate
```

Example structure:

```text
-----------------------------------------
|                                       |
|  [Headline]           [Product Image]|
|                                       |
|  Short description                    |
|                                       |
|  [Shop Now] [Explore Products]        |
|                                       |
-----------------------------------------
```

The product image should have visual prominence.

Use subtle floating effects, shadows, depth or background shapes where appropriate.

Do not over-animate the hero.

---

# 9. Hero Animation

Use modern motion design.

On initial page load:

* Headline fades/slides in
* Supporting text appears slightly afterward
* CTA appears next
* Product image gently scales/fades in

Use a subtle staggered animation.

Example timing:

```text
Product        0ms
Headline      100ms
Description   200ms
CTA           300ms
```

Keep animations short and smooth.

Avoid slow cinematic animations that delay usability.

---

# 10. Product Cards

Product cards are extremely important.

Design them as premium product showcases rather than simple rectangles.

A card can contain:

```text
┌──────────────────────────────┐
│              ♡              │
│                              │
│       PRODUCT IMAGE          │
│                              │
│        [SALE]                │
├──────────────────────────────┤
│ Product Name                 │
│ Short description            │
│                              │
│ ★★★★★                       │
│                              │
│ ₹999    ₹1,299               │
│                              │
│ [ Add to Cart ]              │
└──────────────────────────────┘
```

But don't force every element into every card.

Keep the card visually clean.

---

# 11. Product Card Hover

On desktop, create subtle interactions.

When the user hovers:

* Product image slightly zooms
* Card subtly lifts
* Shadow increases slightly
* Wishlist icon becomes more prominent
* Add-to-cart action becomes clearer

Example:

```text
Normal
scale: 1

Hover
image: 1.03
card: translateY(-4px)
```

Keep the effect subtle.

Never create exaggerated bouncing or spinning cards.

---

# 12. Product Image Treatment

Product images should feel premium.

Use:

* Proper aspect ratios
* Consistent image containers
* `object-fit: contain` or `cover` based on product photography
* Soft backgrounds
* Subtle shadows where appropriate
* Hover image transitions

Never distort product images.

Never stretch images.

---

# 13. Product Detail Page

The product detail page should feel like a premium product presentation.

Use a layout such as:

```text
------------------------------------------------
|                                               |
|  Product Gallery      Product Information    |
|                                               |
|  [ Large Image ]       Product Name           |
|                         Rating                |
|                         Price                 |
|                         Description           |
|                         Variant               |
|                         Quantity              |
|                         [Add to Cart]         |
|                         [Buy Now]             |
|                                               |
------------------------------------------------
```

Use a sticky product information section on desktop where appropriate.

---

# 14. Product Gallery

Create a beautiful image gallery.

Features:

* Large main image
* Thumbnail navigation
* Smooth image transitions
* Zoom capability
* Mobile swipe support
* Full-screen image viewer if appropriate

When switching images:

Use a smooth crossfade/slide.

Do not make the transition distracting.

---

# 15. Buy Now CTA

The primary purchase button should visually stand out.

Example:

```text
┌────────────────────────────┐
│        BUY NOW              │
└────────────────────────────┘
```

Use strong contrast.

Add subtle hover feedback.

On click:

```text
Button
   ↓
Loading state
   ↓
Checkout
```

Never leave the user wondering whether their click worked.

---

# 16. Add to Cart Animation

When the customer clicks:

**Add to Cart**

provide immediate visual feedback.

For example:

```text
Add to Cart
     ↓
Button animation
     ↓
Cart icon subtly reacts
     ↓
Toast / mini-cart
```

Possible animation:

```text
Add to Cart
     ↓
✓ Added
     ↓
Return to normal
```

Keep it under approximately 1 second.

---

# 17. Cart Drawer

Instead of always forcing the customer to navigate to `/cart`, create a premium mini-cart drawer.

Example:

```text
                    ┌─────────────────────┐
                    │ Your Cart       ×   │
                    │                     │
                    │ Product             │
                    │ ₹999                │
                    │                     │
                    │ Product             │
                    │ ₹799                │
                    │                     │
                    │ Subtotal             │
                    │ ₹1,798               │
                    │                     │
                    │ [View Cart]         │
                    │ [Checkout]          │
                    └─────────────────────┘
```

Animate it smoothly from the right.

---

# 18. Navigation

Create a premium sticky header.

Desktop:

```text
LOGO     Home  Shop  Categories  About       Search ♡ 🛒 Account
```

The header should:

* Become slightly compact while scrolling
* Have subtle backdrop treatment
* Maintain excellent readability
* Remain accessible

Don't make the header excessively tall.

---

# 19. Mobile Navigation

Mobile should receive equal design attention.

Create:

```text
Logo        Search     Cart
             │
             ▼
        Hamburger
```

Use a smooth mobile navigation drawer.

Touch targets should be large enough.

Do not simply shrink the desktop UI.

Design mobile layouts intentionally.

---

# 20. Category Sections

Create attractive category cards.

Instead of basic:

```text
Category 1
Category 2
Category 3
```

use product imagery and visual storytelling.

Example:

```text
┌──────────────────────┐
│                      │
│      IMAGE           │
│                      │
│  Category Name       │
│  Explore →           │
│                      │
└──────────────────────┘
```

On hover:

* Image zoom
* Overlay changes slightly
* Arrow moves
* Card lifts

---

# 21. Featured Products

Create a section such as:

```text
Featured Collection

Discover products selected for you.
```

Display products in an elegant grid.

Use responsive columns:

```text
Desktop → 4
Tablet  → 2/3
Mobile  → 2 or 1 depending on product type
```

Do not overcrowd mobile screens.

---

# 22. Best Sellers

Create a visually distinct section for best-selling products.

Possible design:

```text
BEST SELLERS

Most loved by our customers

[Product] [Product] [Product] [Product]
```

Use subtle badges:

```text
Best Seller
Popular
Trending
```

Only display badges when the underlying data supports them.

Do not fabricate claims.

---

# 23. Trust Section

Customers need confidence before purchasing.

Create a visual trust section with benefits relevant to the actual business.

Potential examples:

```text
✓ Secure Payments
✓ Quality Products
✓ Fast Delivery
✓ Easy Support
```

Only show claims that the business actually provides.

Use clean icons and subtle animations.

---

# 24. Storytelling Section

Add a brand/product storytelling section.

For example:

```text
                    [Product Image]

       Why choose Aditi?

       Short emotional/product-focused
       story about the product.

       [Discover More →]
```

The purpose is to create an emotional connection with the brand.

Use editorial-style typography and high-quality imagery.

---

# 25. Customer Reviews

Design reviews as premium social-proof cards.

Example:

```text
★★★★★

"Customer review..."

— Customer Name
Verified Purchase
```

Use:

* Rating
* Review
* Customer name
* Verified purchase badge where actually verified

Animate cards subtly when they enter the viewport.

---

# 26. FAQ Section

Create an elegant accordion.

When opening:

* Smooth height animation
* Rotate chevron
* Preserve accessibility

Example:

```text
What is your delivery time?           +
How can I track my order?             +
What is your return policy?           +
```

---

# 27. Newsletter

Create a visually attractive newsletter section.

Instead of a boring:

```text
Email [Subscribe]
```

create a branded section.

Example:

```text
-----------------------------------------
        Stay in the Aditi world

      Get updates, offers and
       new product launches.

        [ Enter email ] [Join]
-----------------------------------------
```

Do not use excessive decoration.

---

# 28. Footer

Create a complete premium footer.

Include:

```text
Aditi
Short brand description

Shop
Products
Categories
New Arrivals

Customer Care
Contact
Shipping
Returns
FAQ

Company
About
Privacy
Terms

Social links

© Aditi
```

---

# 29. Scroll Animations

Use scroll-based animations carefully.

Recommended:

* Fade-up
* Fade-in
* Scale-in
* Horizontal reveal
* Image parallax in selected sections

Avoid:

* Excessive parallax
* Continuous spinning
* Large bouncing elements
* Distracting backgrounds

The animation should make the website feel alive without hurting usability.

---

# 30. Animation Technology

If the project already uses an animation library, use it consistently.

If needed, use:

**Framer Motion / Motion for React**

for:

* Page transitions
* Modal animations
* Drawer animations
* Product card interactions
* Scroll reveal
* Stagger animations
* Micro-interactions

Use CSS transitions for simple interactions instead of JavaScript animation when possible.

Do not introduce multiple animation libraries unnecessarily.

---

# 31. Page Transitions

Create subtle transitions between pages.

For example:

```text
Current page
      ↓
fade/slide
      ↓
new page
```

Keep transitions extremely short.

Never make the user wait for an animation before they can interact.

---

# 32. Loading States

Create beautiful skeleton loaders.

Do not show blank screens.

For product cards:

```text
┌──────────────────┐
│ ████████████████ │
│ ████████████████ │
│                  │
│ ██████████       │
│ ███████          │
│                  │
│ ████████         │
└──────────────────┘
```

Skeletons should match the actual layout.

---

# 33. Micro Interactions

Add small interactions throughout the website:

### Buttons

* Hover
* Press
* Loading
* Success

### Wishlist

```text
♡ → ♥
```

with a subtle animation.

### Cart

Cart icon can subtly react when an item is added.

### Search

Search input can expand smoothly.

### Dropdowns

Use smooth but fast transitions.

### Form validation

Show inline validation without making the UI jump unexpectedly.

---

# 34. Empty States

Create attractive empty states.

Examples:

### Empty Cart

```text
        🛍

    Your cart is empty

   Discover something
      you'll love.

    [Start Shopping]
```

### Empty Wishlist

```text
       ♡

   Nothing saved yet

Save products you love
   for later.

   [Explore Products]
```

Do not use ugly default browser messages.

---

# 35. Error States

Design friendly error states.

Example:

```text
Something went wrong.

We couldn't load this product.

[Try Again]
```

Avoid showing technical stack traces to customers.

---

# 36. Checkout UI

Checkout should feel extremely trustworthy.

Use a clean distraction-free layout.

Example:

```text
Checkout

Shipping Information
─────────────────────

Payment
─────────────────────

Order Summary
─────────────────────

      [Pay Securely]
```

Show security/trust indicators where legitimate.

Do not create fake security badges.

---

# 37. Payment Success Animation

After successful payment, create a polished success screen.

Example:

```text
             ✓

       Order Confirmed

   Thank you for your purchase.

      Order #AD12345

    [Track Order]
    [Continue Shopping]
```

Use a subtle checkmark animation.

Do not make it excessively celebratory.

---

# 38. Admin UI

The admin panel should have a different visual language from the storefront.

It should prioritize:

* Clarity
* Efficiency
* Data visibility
* Fast workflows

Use:

* Sidebar
* Top navigation
* Tables
* Filters
* Search
* Status badges
* Modals
* Forms
* Charts only where useful

Do not over-design the admin panel.

---

# 39. Admin Dashboard

Create useful summary cards:

```text
Revenue
Orders
Customers
Products
Low Stock
```

Use charts only when they provide actionable information.

Examples:

* Sales over time
* Orders by status
* Top products

Keep the dashboard clean.

---

# 40. Responsive Design

Test all UI at:

```text
320px
375px
390px
414px
768px
1024px
1280px
1440px
1920px
```

The website should not break at intermediate widths.

Pay particular attention to:

* Product grids
* Header
* Product detail
* Cart
* Checkout
* Admin tables
* Modals
* Forms

---

# 41. Accessibility

Animations must respect:

```text
prefers-reduced-motion
```

If a user has reduced motion enabled:

* Reduce transitions
* Disable unnecessary parallax
* Avoid large movement
* Preserve usability

Maintain:

* Keyboard navigation
* Focus states
* Screen-reader compatibility
* Semantic HTML
* Accessible contrast

---

# 42. Performance Rules

Beautiful does NOT mean slow.

Follow these rules:

* Don't load huge animation libraries unnecessarily
* Don't animate expensive properties
* Prefer `transform` and `opacity`
* Optimize images
* Lazy-load below-the-fold images
* Avoid excessive JavaScript
* Keep Server Components server-side
* Avoid unnecessary Client Components
* Avoid animation on every element
* Avoid video backgrounds unless genuinely valuable

The final website should remain fast.

---

# 43. Visual Hierarchy

Every page should have a clear hierarchy:

```text
Primary information
       ↓
Secondary information
       ↓
Supporting information
       ↓
CTA
```

Don't make every element equally prominent.

The customer should immediately know:

**What is this?**

**Why should I care?**

**What should I do next?**

---

# 44. Conversion-Focused Design

The UI should naturally guide customers toward purchasing without becoming aggressive.

Use:

* Clear CTAs
* Strong product imagery
* Product benefits
* Reviews
* Trust signals
* Simple checkout
* Visible pricing
* Clear discounts
* Stock information when legitimate
* Related products

Avoid:

* Fake urgency
* Fake scarcity
* Fake reviews
* Misleading discounts
* Manipulative popups
* Excessive notifications

Build trust rather than pressure.

---

# 45. Premium Details

Add small details that make the site feel professionally designed.

Examples:

* Custom hover states
* Consistent border radius
* Carefully tuned shadows
* Smooth image transitions
* Elegant separators
* Subtle background textures
* Consistent iconography
* Beautiful focus states
* Carefully aligned elements
* Consistent spacing

These details matter more than adding flashy effects everywhere.

---

# 46. Design System

Create reusable design tokens.

Define:

```text
Colors
Typography
Spacing
Border radius
Shadows
Transitions
Animation durations
Breakpoints
```

Example:

```text
radius-sm
radius-md
radius-lg
radius-xl

shadow-sm
shadow-md
shadow-lg

duration-fast
duration-normal
duration-slow
```

Use the design system consistently throughout the application.

---

# 47. Component Reusability

Create reusable components such as:

```text
ProductCard
ProductGrid
ProductGallery
PriceDisplay
RatingStars
AddToCartButton
WishlistButton
CartDrawer
CategoryCard
SectionHeading
TrustBadge
ReviewCard
FAQAccordion
Newsletter
Header
Footer
```

Avoid duplicating UI logic.

---

# 48. Important Design Rule

Do NOT turn the website into a collection of animations.

The goal is:

```text
Premium UI
     +
Excellent UX
     +
Fast performance
     +
Strong product presentation
```

Not:

```text
Animation everywhere
     +
Gradients everywhere
     +
Glassmorphism everywhere
```

Use visual effects with purpose.

---

# 49. Final Quality Check

Before considering the UI complete, verify:

### Visual

* [ ] Brand identity is consistent
* [ ] Colors are harmonious
* [ ] Typography is consistent
* [ ] Product imagery looks premium
* [ ] Cards look polished
* [ ] Buttons have proper states
* [ ] Header looks professional
* [ ] Footer looks complete

### Animation

* [ ] Hero animation
* [ ] Product hover
* [ ] Add-to-cart feedback
* [ ] Wishlist animation
* [ ] Cart drawer animation
* [ ] Scroll reveal
* [ ] Modal transitions
* [ ] Page transitions where useful
* [ ] Reduced-motion support

### UX

* [ ] Mobile responsive
* [ ] Fast interactions
* [ ] Clear CTA
* [ ] Clear product information
* [ ] Easy checkout
* [ ] Good loading states
* [ ] Good empty states
* [ ] Good error states

### Performance

* [ ] Optimized images
* [ ] No unnecessary client components
* [ ] No excessive JavaScript animation
* [ ] No layout shifts
* [ ] Smooth scrolling
* [ ] Good Core Web Vitals

### Accessibility

* [ ] Keyboard navigation
* [ ] Focus states
* [ ] Proper labels
* [ ] Proper contrast
* [ ] Reduced motion
* [ ] Screen-reader-friendly structure

---

# 50. Final Creative Direction

The final website should create this feeling when a customer opens it:

> "This looks like a premium brand."

Then:

> "The product looks really good."

Then:

> "I trust this website."

And finally:

> "I want to buy this."

Achieve that through **product presentation, typography, color, spacing, imagery, trust, micro-interactions and smooth motion** — not through excessive visual effects.

Build the UI so that the **product remains the hero**.

The design should be modern enough to feel current in 2026 while remaining timeless enough that it does not look outdated after a few months.

Do not copy an existing brand or website. Create an original visual identity for **Aditi** based on the actual product and available brand assets.
