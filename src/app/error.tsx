"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="[&_h1]:[margin:0] [&_h1]:[font:400_clamp(46px,_6vw,_78px)/1_var(--serif)] [&_h1]:[letter-spacing:-.06em] [min-height:80vh] [display:flex] [flex-direction:column] [align-items:center] [justify-content:center] [padding:40px_20px] [text-align:center] [&>p:not(.eyebrow)]:[margin:22px_0_29px] [&>p:not(.eyebrow)]:[color:var(--muted)] [&>p:not(.eyebrow)]:[font-size:14px]"><p className="eyebrow [margin:0_0_21px] [font:10px_var(--mono)] [letter-spacing:.14em] [text-transform:uppercase] [color:var(--muted)]">Something went wrong</p><h1>We could not load this page.</h1><p>Try again, or return to the shop.</p><button className="button [min-height:46px] [display:inline-flex] [align-items:center] [justify-content:center] [gap:15px] [padding:0_21px] [font:10px_var(--mono)] [letter-spacing:.08em] [text-transform:uppercase] [transition:transform_.25s_ease,_background_.25s_ease] [&:hover]:[transform:translateY(-2px)] [color:var(--paper)] [background:var(--ink)]" onClick={reset}>Try again <RefreshCw size={15} /></button></main>;
}
