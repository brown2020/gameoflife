import React, { memo } from "react";

/** Consolidated button variants for consistent styling */
const variants = {
  primary: "bg-green-600 hover:bg-green-500",
  secondary: "bg-gray-600 hover:bg-gray-500",
  danger: "bg-red-500 hover:bg-red-400",
  accent: "bg-amber-600 hover:bg-amber-500",
  info: "bg-blue-600 hover:bg-blue-500",
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
