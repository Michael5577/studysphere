import { cn } from "@/lib/utils";
import { type LabelHTMLAttributes } from "react";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function Label({
  className,
  children,
  required,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn("text-label text-muted", className)}
      {...props}
    >
      {children}
      {required && <span className="ml-0.5 text-error">*</span>}
    </label>
  );
}
