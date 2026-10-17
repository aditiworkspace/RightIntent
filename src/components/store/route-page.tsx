import { SiteHeader } from "@/components/store/home/site-header";

export function RoutePage({
  eyebrow,
  title,
  description,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={`max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 pt-12 pb-24 max-[960px]:pt-8 max-[960px]:pb-20 max-[960px]:px-5 ${className}`}
    >
      <div className="max-w-[760px] mb-12 sm:mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[rgba(28,38,34,0.05)] border border-[rgba(28,38,34,0.08)]">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--terra)]" />
          <p className="m-0 font-[family-name:var(--mono)] text-[10px] tracking-[0.14em] uppercase text-[var(--muted)]">
            {eyebrow}
          </p>
        </div>
        <h1 className="m-0 font-normal text-[clamp(36px,5vw,64px)] leading-[1.08] font-[family-name:var(--serif)] tracking-[-0.04em] text-[var(--ink)]">
          {title}
        </h1>
        {description && (
          <p className="max-w-[560px] mt-4 mb-0 text-[var(--muted)] text-[15px] leading-[1.7] font-[family-name:var(--sans)]">
            {description}
          </p>
        )}
      </div>
      {children}
    </main>
  );
}

export function RouteNav() {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(244,240,233,0.95)] border-b border-[var(--line)]">
      <div className="h-[32px] flex items-center justify-center bg-[var(--ink)] text-[var(--paper)] font-[family-name:var(--mono)] text-[10px] tracking-[0.06em] uppercase px-4 text-center">
        <span>Free 2027 calendar + intentions card on every order · Complimentary shipping over Rs. 999</span>
      </div>
      <SiteHeader cartCount={0} savedCount={0} />
    </div>
  );
}
