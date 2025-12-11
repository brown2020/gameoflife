import React, { memo } from "react";

const variants = {
  primary: "bg-green-600 hover:opacity-90",
  danger: "bg-red-500 hover:opacity-90",
  secondary: "bg-gray-600 hover:bg-gray-500",
  accent: "bg-amber-600 hover:bg-amber-500",
  info: "bg-indigo-600 hover:bg-indigo-500",
  purple: "bg-purple-600 hover:bg-purple-500",
  blue: "bg-blue-500 hover:bg-blue-600",
} as const;

type ButtonVariant = keyof typeof variants;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** Fixed width in Tailwind class format (e.g., "w-20") */
  fixedWidth?: string;
}

export const Button = memo<ButtonProps>(
  ({
    variant = "secondary",
    className = "",
    fixedWidth,
    children,
    ...props
  }) => (
    <button
      className={`px-3 py-1.5 text-xs font-medium text-white rounded ${
        variants[variant]
      } ${fixedWidth ?? ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
