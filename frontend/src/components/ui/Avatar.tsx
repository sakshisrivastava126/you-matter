import React from "react";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

/** Generates a deterministic hue from a name string */
const nameToHue = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
};

const sizeMap = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

export const Avatar = ({ name, size = "md", className = "" }: AvatarProps) => {
  const hue = nameToHue(name);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`
        ${sizeMap[size]} rounded-full flex items-center justify-center
        font-bold flex-shrink-0 select-none
        ${className}
      `}
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${(hue + 40) % 360}, 70%, 45%))`,
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
};
