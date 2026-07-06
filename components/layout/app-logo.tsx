import { cn } from "@/lib/utils";
import Image from "next/image";

interface AppLogoProps {
  size?: number;
  className?: string;
}

export function AppLogo({ size = 28, className }: AppLogoProps) {
  return (
    <Image
      src="/logo-emblem.png"
      alt="StudySphere"
      width={size}
      height={size}
      unoptimized
      className={cn("shrink-0 rounded-[var(--radius)]", className)}
      priority
    />
  );
}
