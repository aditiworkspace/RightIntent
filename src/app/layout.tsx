import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Right Intent | Journals, Planners & Tools to Build with Purpose",
    template: "%s | Right Intent",
  },
  description: "Journals, planners and thoughtful tools to help you build with purpose. Made slowly, chosen carefully, and meant to stay with you.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="scroll-smooth"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className="m-0 [background-color:var(--paper)] [color:var(--ink)] [font-family:var(--sans)]"
      >
        {children}
      </body>
    </html>
  );
}
