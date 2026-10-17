import { Sparkles } from "lucide-react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function AnnouncementBar() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "announcement").maybeSingle();
  const settings = (data?.value ?? {}) as { enabled?: boolean; text?: string; linkText?: string; link?: string };
  if (settings.enabled === false) return null;
  return (
    <div
      className={`
        flex items-center justify-center gap-2 bg-[#152b21] text-[#f4f0e9] [height:31px] [display:flex]
        [align-items:center] [justify-content:center] [gap:10px] [background:var(--ink)]
        [color:var(--paper)] [font:10px_var(--mono)] [letter-spacing:.04em] [text-transform:uppercase]
        [position:relative] [&_span]:[color:#b6c5b6] [&_span]:[margin-left:20px]
        max-[960px]:[padding:0_42px_0_15px] max-[960px]:[font-size:8px]
        max-[960px]:[justify-content:flex-start] max-[960px]:[gap:6px] max-[960px]:[white-space:nowrap]
        max-[960px]:[overflow:hidden] max-[960px]:[&_span]:[display:none] [&_strong]:[color:#f1e7d3]
        [&_strong]:[font-weight:500] [&_a]:[margin-left:28px] [&_a]:[padding:6px_14px]
        [&_a]:[border:1px_solid_rgba(244,_240,_233,_.45)] [&_a]:[border-radius:18px]
        [&_a]:[color:#f1e7d3] [&_a]:[font-size:9px] [&_button]:[position:absolute]
        [&_button]:[right:30px] [&_button]:[color:#dce4d9] [&_button]:[font-size:20px]
        [&_button]:[line-height:1] max-[960px]:[&_strong]:[font-size:8px]
        max-[960px]:[&_strong]:[overflow:hidden] max-[960px]:[&_strong]:[text-overflow:ellipsis]
        max-[960px]:[&_a]:[display:none] max-[960px]:[&_button]:[right:14px]
      `}
    >
      <Sparkles size={14} />{" "}
      <strong>{settings.text || "Free 2027 calendar + intentions card on every order"}</strong>
      <span>|</span>
      <span>Free shipping on orders over Rs. 2,000</span>
      <a href={settings.link || "#journal"}>{settings.linkText || "Join our community"}</a>
      <button aria-label="Dismiss announcement">×</button>
    </div>
  );
}
