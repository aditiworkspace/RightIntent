import Image from "next/image";
import Link from "next/link";
import logo from "@/assests/RightIntentLogo.png";

export function BrandLogo({ href = "/", label = "Right Intent" }: { href?: string; label?: string }) {
  return (
    <Link className="wordmark brand-logo [font:500_29px_var(--serif)] [letter-spacing:-.07em] [&_span]:[color:var(--terra)] [display:inline-flex] [width:72px] [height:72px] [flex:0_0_auto] [align-items:center] [justify-content:center] [overflow:hidden] [font-size:0] [letter-spacing:0] [&_img]:[display:block] [&_img]:[width:100%] [&_img]:[height:100%] [&_img]:[object-fit:contain]" href={href} aria-label={label}>
      <Image src={logo} alt={label} priority />
    </Link>
  );
}
