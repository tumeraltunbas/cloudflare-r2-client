import { createHashRouter, Navigate } from "react-router";
import { Layout } from "../components/layout/index.tsx";
import { ListBuckets } from "../pages/list-buckets";
import { fetchBucketsLoader } from "../services/loaders/buckets.loader";
import { ListObjects } from "../pages/list-objects/index.tsx";
import { fetchObjectsLoader } from "../services/loaders/objects.loader.ts";

export default createHashRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <Navigate to="/buckets" replace />,
			},
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
