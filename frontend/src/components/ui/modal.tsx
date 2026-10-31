import React from "react";
import { cx } from "../../utils/cx";
import { Button } from "./button";

type ModalSize = "md" | "lg" | "xl";

const sizes: Record<ModalSize, string> = {
	md: "max-w-md",
	lg: "max-w-3xl",
	xl: "max-w-5xl",
};

interface ModalProps {
	open: boolean;
	title: string;
	description?: string;
	confirmLabel?: string;
	pendingLabel?: string;
	cancelLabel?: string;
	confirmVariant?: "primary" | "danger";
	size?: ModalSize;
	isConfirming?: boolean;
	confirmDisabled?: boolean;
	onConfirm: () => void;
	onClose: () => void;
	children?: React.ReactNode;
}

export const Modal = ({
	open,
	title,
	description,
	confirmLabel = "Confirm",
	pendingLabel,
	cancelLabel = "Cancel",
	confirmVariant = "primary",
	size = "md",
	isConfirming = false,
	confirmDisabled = false,
	onConfirm,
	onClose,
	children,
}: ModalProps) => {
	React.useEffect(() => {
		if (!open) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape" && !isConfirming) {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [open, onClose, isConfirming]);

	if (!open) {
		return null;
	}

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 animate-fade-in"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget && !isConfirming) {
					onClose();
				}
			}}
		>
			<div
				role="dialog"
				aria-modal="true"
				aria-label={title}
				className={cx(
					"w-full rounded-xl border border-line bg-surface shadow-pop animate-scale-in",
					sizes[size]
				)}
			>
				<div
					className={cx(
						"px-5 py-4",
						Boolean(children) && "border-b border-line"
					)}
				>
					<h2 className="text-base font-semibold text-ink-900">{title}</h2>
					{description && (
						<p className="mt-1 text-sm text-ink-500">{description}</p>
					)}
				</div>

				{children ? <div className="px-5 py-4">{children}</div> : null}

				<div className="flex justify-end gap-2 rounded-b-xl border-t border-line bg-surface-raised px-5 py-3.5">
					<Button
						variant="secondary"
						onClick={onClose}
						disabled={isConfirming}
					>
						{cancelLabel}
					</Button>
					<Button
						variant={confirmVariant}
						onClick={onConfirm}
						disabled={isConfirming || confirmDisabled}
					>
						{isConfirming ? (pendingLabel ?? confirmLabel) : confirmLabel}
					</Button>
				</div>
			</div>
		</div>
	);
};

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	hint?: string;
}

export const TextField = ({ label, hint, className, ...props }: TextFieldProps) => (
	<label className="block">
		{label && (
			<span className="mb-1.5 block text-sm font-medium text-ink-700">
				{label}
			</span>
		)}
		<input
			className={cx(
				"w-full rounded-lg border border-line bg-surface-canvas px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400",
				"transition-colors duration-150 hover:border-ink-200 focus:border-cloudflare-orange focus:outline-none focus:ring-2 focus:ring-cloudflare-orange/25",
				className
			)}
			{...props}
		/>
		{hint && <span className="mt-1.5 block text-xs text-ink-400">{hint}</span>}
	</label>
);
