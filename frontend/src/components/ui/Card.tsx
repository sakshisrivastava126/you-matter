import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
}

export const Card = ({ children, className = "", glass: _glass = true }: CardProps) => {
  return (
    <div
      className={`
        rounded-2xl border border-[#E8EDF2] bg-white
        shadow-[0_2px_12px_rgba(74,111,165,.07)]
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
  <div className={`px-6 pt-6 pb-4 border-b border-[#E8EDF2] ${className}`}>
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
