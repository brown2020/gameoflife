import React, { memo } from "react";

/** Consolidated button variants for consistent styling */
const variants = {
  primary: "bg-green-700 hover:bg-green-600",
  secondary: "bg-gray-700 hover:bg-gray-600",
  danger: "bg-red-700 hover:bg-red-600",
  accent: "bg-amber-700 hover:bg-amber-600",
  info: "bg-blue-700 hover:bg-blue-600",
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
  }) => {
    const classes = [
      "px-3 py-1.5 text-xs font-medium text-white rounded",
      variants[variant],
      fixedWidth,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
