import { createBrowserRouter } from "react-router";
import { Layout } from "../components/layout/index.tsx";
import { ListBuckets } from "../pages/list-buckets";
import { fetchBucketsLoader } from "../services/loaders/buckets.loader";
import { ListObjects } from "../pages/list-objects/index.tsx";
import { fetchObjectsLoader } from "../services/loaders/objects.loader.ts";

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
			{
				path: "buckets/:name/objects",
				element: <ListObjects />,
				loader: fetchObjectsLoader,
			},
		],
	},
]);
