import React from "react";
import { cx } from "../../utils/cx";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: ButtonVariant;
}

const base =
	"inline-flex items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
	primary:
		"bg-cloudflare-orange text-ink-950 shadow-sm hover:bg-cloudflare-orange-bright active:bg-cloudflare-orange-deep",
	secondary:
		"border border-line bg-surface-raised text-ink-700 shadow-sm hover:border-ink-200 hover:bg-surface-overlay active:bg-surface-overlay",
	danger:
		"bg-danger-600 text-white shadow-sm hover:bg-danger-700 active:bg-danger-700",
	ghost: "text-ink-600 hover:bg-surface-overlay hover:text-ink-900",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ variant = "primary", className, type = "button", ...props }, ref) => (
		<button
			ref={ref}
			type={type}
			className={cx(base, variants[variant], className)}
			{...props}
		/>
	)
);

Button.displayName = "Button";
