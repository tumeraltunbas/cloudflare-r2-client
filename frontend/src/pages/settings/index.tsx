import React from "react";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { TextField } from "../../components/ui/modal";

interface SettingsProps {
	onSaved: () => void;
}

export function Settings({ onSaved }: SettingsProps) {
	const [accountId, setAccountId] = React.useState("");
	const [apiKey, setApiKey] = React.useState("");
	const [isSaving, setIsSaving] = React.useState(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!accountId.trim() || !apiKey.trim()) {
			toast.error("Enter both your account ID and API key.");
			return;
		}

		setIsSaving(true);

		try {
			await window.api.saveCredentials({
				accountId: accountId.trim(),
				apiKey,
			});
			onSaved();
		} catch (error) {
			toast.error(
				error instanceof Error
					? error.message
					: "Unable to save your Cloudflare credentials."
			);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<main className="flex min-h-screen items-center justify-center bg-surface-canvas px-6 py-8">
			<form
				className="w-full max-w-md space-y-6 rounded-xl border border-line bg-surface p-6 shadow-pop"
				onSubmit={handleSubmit}
			>
				<div>
					<div className="flex items-center gap-2.5">
						<img
							src={`${import.meta.env.BASE_URL}cloudflare.webp`}
							alt=""
							className="h-8 w-8 rounded-md object-contain"
						/>
						<span className="text-sm font-semibold tracking-tight text-ink-900">
							R2 Client
						</span>
					</div>
					<h1 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">
						Connect your Cloudflare account
					</h1>
					<p className="mt-1 text-sm text-ink-500">
						Enter your credentials to start managing your R2
						buckets. They are stored securely on this device.
					</p>
				</div>

				<div className="space-y-4">
					<TextField
						label="Account ID"
						placeholder="Your Cloudflare account ID"
						value={accountId}
						onChange={(event) => setAccountId(event.target.value)}
						required
						autoComplete="username"
					/>
					<TextField
						label="API Key"
						placeholder="Your Cloudflare API key"
						type="password"
						value={apiKey}
						onChange={(event) => setApiKey(event.target.value)}
						required
						autoComplete="current-password"
					/>
				</div>

				<Button className="w-full" type="submit" disabled={isSaving}>
					{isSaving ? "Saving..." : "Save credentials"}
				</Button>
			</form>
		</main>
	);
}
