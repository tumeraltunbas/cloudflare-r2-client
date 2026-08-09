import { RouterProvider } from "react-router";
import router from "./router/index.tsx";
import { Fragment } from "react/jsx-runtime";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client.ts";
import { ConfigProvider, theme } from "antd";

function App() {
	return (
		<Fragment>
			<ConfigProvider
				theme={{
					algorithm: theme.darkAlgorithm,
					token: {
						colorPrimary: "#f48120",
					},
				}}
			>
				<QueryClientProvider client={queryClient}>
					<RouterProvider router={router} />
				</QueryClientProvider>
			</ConfigProvider>
		</Fragment>
	);
}

export default App;
