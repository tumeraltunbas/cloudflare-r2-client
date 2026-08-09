import { Outlet } from "react-router";

export function Layout() {
	return (
		<div className="m-10">
			<Outlet />
		</div>
	);
}
