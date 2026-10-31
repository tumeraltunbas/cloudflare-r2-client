import { RouterProvider } from "react-router";
import router from "./router/index.tsx";
import { Fragment } from "react/jsx-runtime";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client.ts";
import { Toaster } from "sonner";

function App() {
	return (
		<Fragment>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
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
