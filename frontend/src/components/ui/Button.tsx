import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-[#4A6FA5] hover:bg-[#3A5A8F] text-white shadow-md shadow-[#4A6FA5]/20 hover:shadow-[#4A6FA5]/30 border border-[#4A6FA5]",
  secondary:
    "bg-[#E6DDF5] hover:bg-[#D8CFF0] text-[#4A6FA5] border border-[#D1C8E8] hover:border-[#BEB4D8]",
  ghost:
    "bg-transparent hover:bg-[#CFE8F3]/50 text-[#5A6475] hover:text-[#4A6FA5] border border-transparent hover:border-[#CFE8F3]",
  danger:
    "bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

export const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2 font-semibold
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5]/40 focus-visible:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        active:scale-[0.97]
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Loading…</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};
