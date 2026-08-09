import { createBrowserRouter } from "react-router";
import { Layout } from "../components/layout/index.tsx";
import { ListBuckets } from "../pages/list-buckets";
import { fetchBucketsLoader } from "../services/loaders/buckets.loader";

export default createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "buckets",
				element: <ListBuckets />,
				loader: fetchBucketsLoader,
			},
		],
	},
]);
