import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function Logo({ className, size = "md", href = "/" }: LogoProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  };

  return (
    <Link href={href} className={cn("flex items-center gap-2 group", className)}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#128c41] to-[#25d366] shadow-glow-green transition-transform group-hover:scale-105">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H8l5-9v4h3l-5 9z" />
        </svg>
      </div>
      <span className={cn("font-bold tracking-tight", sizes[size])}>
        <span className="text-[#0a0f0d]">BOTFILTA</span>
        <span className="gradient-text"> AI</span>
      </span>
    </Link>
  );
}
