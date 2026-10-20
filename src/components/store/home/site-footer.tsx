"use client";

import Link from "next/link";

const PRODUCT_LINKS = [
  { label: "All Products", href: "/products" },
  { label: "Journals & Prompts", href: "/products?category=trade" },
  { label: "Planners & Trackers", href: "/products?category=carry" },
  { label: "Intelligent Trader", href: "/#intelligent-trader" },
  { label: "Handcrafted Objects", href: "/category/objects" },
  { label: "Curated Gift Sets", href: "/products" },
];

const COMPANY_LINKS = [
  { label: "About Right Intent", href: "/#story" },
  { label: "Voice of CEO", href: "/#voice-of-ceo" },
  { label: "Craftsmanship", href: "/#voice-of-ceo" },
  { label: "Sustainability", href: "/#story" },
  { label: "Atelier Journal", href: "/#voice-of-ceo" },
  { label: "Contact Us", href: "mailto:hello@rightintent.world" },
];

const SUPPORT_LINKS = [
  { label: "Shipping & Delivery", href: "/#faq" },
  { label: "7-Day Easy Returns", href: "/#faq" },
  { label: "FAQs & Orders", href: "/#faq" },
  { label: "Paper Care Guide", href: "/#faq" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

const SOCIAL_CHANNELS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    path: "M7.8 2h8.4A5.81 5.81 0 0 1 22 7.8v8.4a5.81 5.81 0 0 1-5.8 5.8H7.8A5.81 5.81 0 0 1 2 16.2V7.8A5.81 5.81 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8A3.6 3.6 0 0 0 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6A3.6 3.6 0 0 0 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7.25A4.75 4.75 0 1 1 12 16.75 4.75 4.75 0 0 1 12 7.25Zm0 2A2.75 2.75 0 1 0 12 14.75 2.75 2.75 0 0 0 12 9.25Z",
  },
  {
    label: "X (Twitter)",
    href: "https://twitter.com",
    path: "M17.63 3h3.17l-6.92 7.91L22 21h-6.35l-4.97-6.5L5 21H1.82l7.4-8.46L1.45 3h6.51l4.49 5.93L17.63 3Zm-1.11 16.22h1.76L7 4.69H5.11l11.41 14.53Z",
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    path: "M21.58 7.19a2.74 2.74 0 0 0-1.93-1.94C17.95 4.8 12 4.8 12 4.8s-5.95 0-7.65.45a2.74 2.74 0 0 0-1.93 1.94A28.55 28.55 0 0 0 2 12a28.55 28.55 0 0 0 .42 4.81 2.74 2.74 0 0 0 1.93 1.94c1.7.45 7.65.45 7.65.45s5.95 0 7.65-.45a2.74 2.74 0 0 0 1.93-1.94A28.55 28.55 0 0 0 22 12a28.55 28.55 0 0 0-.42-4.81ZM10 15.2V8.8l5.2 3.2L10 15.2Z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    path: "M6.94 8.97H3.25V20h3.69V8.97ZM5.09 3.5A2.14 2.14 0 1 0 5.1 7.78 2.14 2.14 0 0 0 5.09 3.5ZM20.75 20h-3.68v-5.36c0-1.28-.02-2.92-1.78-2.92-1.78 0-2.05 1.39-2.05 2.82V20H9.56V8.97h3.53v1.51h.05a3.87 3.87 0 0 1 3.48-1.91c3.72 0 4.41 2.45 4.41 5.64V20h-.28Z",
  },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#152213] text-[#e8eee4]">
      {/* ─── MAIN FOOTER CONTENT (CLEAN 4-COLUMN ARCHITECTURE) ─── */}
      <div className="max-w-[1680px] mx-auto px-5 sm:px-8 pt-9 sm:pt-12 pb-6">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-x-6 gap-y-7 lg:gap-10 items-start">
          {/* ─── COLUMN 1: BRAND MANIFESTO ─── */}
          <div className="col-span-2 lg:col-span-1 flex flex-col items-start pr-0 lg:pr-6">
            <h2 className="m-0 mt-3 font-[family-name:var(--serif)] text-[23px] sm:text-[27px] font-normal leading-[1.2] text-[#f4f7f2] tracking-[-0.02em]">
              “We build for the slow
              <br className="hidden sm:block" />
              morning, not on the discount.”
            </h2>

            {/* Concise Subtitle */}
            <p className="mt-2 mb-4 text-[13px] leading-relaxed text-[#96a793] max-w-[340px] font-[family-name:var(--sans)]">
              Thoughtfully designed journals, planners and archival everyday
              tools. Consistent batch quality. Honest labels.
            </p>

            {/* Minimalist Social Icons */}
            <div className="flex items-center gap-2">
              {SOCIAL_CHANNELS.map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-full border border-[#2b3a29] bg-[#1a2817] text-[#96a793] hover:text-[#f4f7f2] hover:border-[#4d6349] flex items-center justify-center transition-all duration-200"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* ─── COLUMN 2: PRODUCTS ─── */}
          <div>
            <span className="block font-[family-name:var(--sans)] text-[13px] font-semibold text-[#f4f7f2] tracking-wide mb-3">
              Products
            </span>
            <ul className="list-none p-0 m-0 space-y-2">
              {PRODUCT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-[#96a793] hover:text-[#f4f7f2] transition-colors duration-150 font-[family-name:var(--sans)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── COLUMN 3: COMPANY ─── */}
          <div>
            <span className="block font-[family-name:var(--sans)] text-[13px] font-semibold text-[#f4f7f2] tracking-wide mb-3">
              Company
            </span>
            <ul className="list-none p-0 m-0 space-y-2">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-[#96a793] hover:text-[#f4f7f2] transition-colors duration-150 font-[family-name:var(--sans)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ─── COLUMN 4: SUPPORT ─── */}
          <div>
            <span className="block font-[family-name:var(--sans)] text-[13px] font-semibold text-[#f4f7f2] tracking-wide mb-3">
              Support
            </span>
            <ul className="list-none p-0 m-0 space-y-2">
              {SUPPORT_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[13px] text-[#96a793] hover:text-[#f4f7f2] transition-colors duration-150 font-[family-name:var(--sans)]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ─── THIN DIVIDER LINE & COPYRIGHT STRIP ─── */}
        <div className="mt-8 pt-4 border-t border-[#233320] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11.5px] font-[family-name:var(--sans)] text-[#7e8f7c]">
          <span>© 2026 Right Intent. — Made in India, crafted for life.</span>
          <div className="flex items-center gap-3">
            <Link
              href="/terms"
              className="hover:text-[#f4f7f2] transition-colors"
            >
              Terms
            </Link>
            <span>·</span>
            <Link
              href="/privacy"
              className="hover:text-[#f4f7f2] transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>

      {/* ─── BASE: BESPOKE DOTTED ARCHITECTURAL WATERMARK (ZERAVIK-INSPIRED) ─── */}
      <div
        className="w-full overflow-hidden select-none pointer-events-none sm:pb-4 max-[960px]:pb-[calc(76px+env(safe-area-inset-bottom))]"
        aria-hidden="true"
      >
        <div className="max-w-[1400px] mx-auto px-0">
          <svg
            viewBox="0 0 1400 135"
            className="w-full h-auto block"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Dotted matrix pattern matching Zeravik's signature style */}
              <pattern
                id="zeravikDotMatrix"
                width="5.5"
                height="5.5"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="2.75" cy="2.75" r="1.3" fill="#586c4c" />
              </pattern>
            </defs>

            {/* Clean, Modern Bold Sans Dotted Letterforms */}
            <text
              x="50%"
              y="105"
              textAnchor="middle"
              fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
              fontSize="112"
              fontWeight="900"
              letterSpacing="14"
              fill="url(#zeravikDotMatrix)"
            >
              RIGHT INTENT
            </text>
          </svg>
        </div>
      </div>
    </footer>
  );
}
