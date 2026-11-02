import { NavLink, Outlet } from "react-router";
import { cx } from "../../utils/cx";

const navItems = [{ to: "/buckets", label: "Buckets" }];

export function Layout() {
	return (
		<div className="flex min-h-screen flex-col bg-surface-canvas">
			<header className="sticky top-0 z-40 border-b border-line bg-surface-canvas/80 backdrop-blur">
				<div className="mx-auto flex h-14 w-full max-w-6xl items-center gap-6 px-6">
					<div className="flex items-center gap-2.5">
						<img
							src={`${import.meta.env.BASE_URL}cloudflare.webp`}
							alt=""
							className="h-7 w-7 rounded-md object-contain"
						/>
						<span className="text-sm font-semibold tracking-tight text-ink-900">
							R2 Client
						</span>
					</div>

					<nav className="flex items-center gap-1">
						{navItems.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								className={({ isActive }) =>
									cx(
										"rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150",
										isActive
											? "bg-cloudflare-orange-tint text-cloudflare-orange-text"
											: "text-ink-600 hover:bg-surface-raised hover:text-ink-900"
									)
								}
							>
								{item.label}
							</NavLink>
						))}
					</nav>
				</div>
			</header>

			<main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
				<Outlet />
			</main>
		</div>
	);
}
