import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean; // enables glassmorphism variant
}

export const Card = ({ children, className = "", glass = true }: CardProps) => {
  return (
    <div
      className={`
        rounded-2xl border border-white/10 
        ${glass ? "bg-white/5 backdrop-blur-md" : "bg-slate-800/60"}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`px-6 pt-6 pb-4 border-b border-white/10 ${className}`}>
    {children}
  </div>
);

export const CardBody = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 ${className}`}>{children}</div>;
