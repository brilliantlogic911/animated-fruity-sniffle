import React, { type CSSProperties, type ButtonHTMLAttributes, type PropsWithChildren } from "react";

export type SX = CSSProperties;

export const Box: React.FC<PropsWithChildren<{ style?: SX; className?: string }>> = ({
  style,
  className,
  children,
}) => {
  return (
    <div style={style} className={className}>
      {children}
    </div>
  );
};

export const Button: React.FC<
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }
> = ({ variant = "primary", style, className, ...props }) => {
  const base: CSSProperties = {
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid transparent",
    cursor: "pointer",
    fontWeight: 600,
  };
  const variants: Record<string, CSSProperties> = {
    primary: { background: "#111827", color: "white", borderColor: "#111827" },
    secondary: { background: "white", color: "#111827", borderColor: "#d1d5db" },
  };
  return (
    <button
      {...props}
      style={{ ...base, ...(variants[variant] || {}), ...(style || {}) }}
      className={className}
    />
  );
};

export const spacing = (n: number) => `${n * 4}px`;