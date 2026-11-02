import { RouterProvider } from "react-router";
import router from "./router/index.tsx";
import { Fragment } from "react/jsx-runtime";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client.ts";
import { Toaster } from "sonner";
import React from "react";
import { Settings } from "./pages/settings";

function App() {
	const [hasCredentials, setHasCredentials] = React.useState<boolean>();
	const [error, setError] = React.useState<string>();

	React.useEffect(() => {
		Promise.resolve()
			.then(() => window.api.hasCredentials())
			.then(setHasCredentials)
			.catch((reason: unknown) => {
				setError(
					reason instanceof Error
						? reason.message
						: "The Electron credential bridge is unavailable."
				);
			});
	}, []);

	if (error) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-surface-canvas px-6 text-center">
				<div>
					<h1 className="text-xl font-semibold text-ink-900">
						Unable to start R2 Client
					</h1>
					<p className="mt-2 max-w-md text-sm text-ink-500">
						{error}
					</p>
				</div>
			</main>
		);
	}

	if (hasCredentials === undefined) {
		return (
			<main className="flex min-h-screen items-center justify-center bg-surface-canvas text-sm text-ink-500">
				Loading R2 Client...
			</main>
		);
	}

	return (
		<Fragment>
			<QueryClientProvider client={queryClient}>
				{hasCredentials ? (
					<RouterProvider router={router} />
				) : (
					<Settings onSaved={() => setHasCredentials(true)} />
				)}
				<Toaster
					theme="dark"
					position="bottom-right"
					toastOptions={{
						classNames: {
							toast: "!rounded-xl !border !border-line !bg-surface-raised !font-sans !text-sm !text-ink-900 !shadow-pop",
							description: "!text-ink-500",
							error: "!border-danger-600/40",
							success: "!border-success-600/40",
						},
					}}
				/>
			</QueryClientProvider>
		</Fragment>
	);
}

export default App;
