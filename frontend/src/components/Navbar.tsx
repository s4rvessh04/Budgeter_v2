import { ReactNode, useState } from "react";
import { Link as WouterLink, useLocation, useRoute } from "wouter";
import { useMutation } from "react-query";
import {
	Bell,
	Compass,
	Home,
	LogOut,
	Menu,
	PlusCircle,
	Settings,
	Users,
	Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { axiosLogout } from "../utils";
import {
	NotificationsModal,
	QuickSettingsModal,
	NewExpenseModal,
	ThemeToggler,
} from "../components";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

interface LinkItemProps {
	name: string;
	path: string;
	icon: React.ElementType;
}

const LinkItems: Array<LinkItemProps> = [
	{ name: "Home", path: "/home", icon: Home },
	{ name: "Friends", path: "/friends", icon: Users },
	{ name: "Discover", path: "/discover", icon: Compass },
	{ name: "Settings", path: "/settings", icon: Settings },
];

export function Navbar({ children }: { children: ReactNode }) {
	const { toast } = useToast();
	const [, setLocation] = useLocation();
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	const mutation = useMutation({
		mutationFn: () => axiosLogout.post("/logout/"),
		onSuccess({ data }) {
			toast({
				title: "Logout Successful!",
				description: data.detail,
				variant: "default",
			});
			setLocation("/");
		},
		onError(err) {
			if (err instanceof Error) {
				toast({
					title: "Error Occured!",
					description: err.message,
					variant: "destructive",
				});
			}
		},
	});

	async function handleLogout() {
		mutation.mutate();
	}

	return (
		<div className="flex min-h-screen w-full flex-col bg-muted/40">
			{/* Mobile Nav */}
			<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 lg:hidden">
				<Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
					<SheetTrigger asChild>
						<Button size="icon" variant="outline" className="lg:hidden">
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="sm:max-w-xs p-0">
						<div className="flex h-full flex-col">
							<SidebarContent
								handleLogout={handleLogout}
								logoutLoading={mutation.isLoading}
								onClose={() => setIsSidebarOpen(false)}
							/>
						</div>
					</SheetContent>
				</Sheet>
				<div className="flex items-center gap-2">
					<Wallet className="h-5 w-5 text-foreground" />
					<span className="text-lg font-bold tracking-tight">Budgeter</span>
				</div>
			</header>

			<div className="flex flex-1 overflow-hidden">
				{/* Desktop Sidebar */}
				<aside className="hidden w-[240px] flex-col border-r bg-background lg:flex">
					<SidebarContent
						handleLogout={handleLogout}
						logoutLoading={mutation.isLoading}
						onClose={() => { }}
					/>
				</aside>

				<main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
					{children}
				</main>
			</div>
		</div>
	);
}

interface SidebarProps {
	onClose: () => void;
	handleLogout: () => void;
	logoutLoading: boolean;
}

const SidebarContent = ({
	onClose,
	handleLogout,
	logoutLoading,
}: SidebarProps) => {
	// Modal states
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const [isSettingsOpen, setIsSettingsOpen] = useState(false);
	const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);

	return (
		<>
			<div className="flex h-full flex-col gap-2">
				<div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
					<Link to="/" className="flex items-center gap-2 font-semibold">
						<Wallet className="h-5 w-5 text-emerald-500" />
						<span className="text-xl font-bold tracking-tight">Budgeter</span>
					</Link>
				</div>

				<div className="flex-1 overflow-auto py-2">
					<nav className="grid items-start px-4 text-sm font-medium">
						<Button
							variant="default"
							className="mb-4 justify-start gap-2 bg-green-600 hover:bg-green-700 text-white"
							onClick={() => setIsNewExpenseOpen(true)}
						>
							<PlusCircle className="h-4 w-4" />
							Add Expense
						</Button>

						{LinkItems.map((link) => (
							<NavLink key={link.name} icon={link.icon} path={link.path} onClick={onClose}>
								{link.name}
							</NavLink>
						))}
					</nav>
				</div>

				<div className="mt-auto border-t p-4">
					<div className="flex items-center justify-between gap-2">
						<ThemeToggler />
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setIsNotifOpen(true)}
							title="Notifications"
						>
							<Bell className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
							onClick={handleLogout}
							disabled={logoutLoading}
							title="Logout"
						>
							<LogOut className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Modals */}
				<NotificationsModal
					isOpen={isNotifOpen}
					onClose={() => setIsNotifOpen(false)}
				/>
				<QuickSettingsModal
					isOpen={isSettingsOpen}
					onClose={() => setIsSettingsOpen(false)}
				/>
				<NewExpenseModal
					isOpen={isNewExpenseOpen}
					onClose={() => setIsNewExpenseOpen(false)}
				/>
			</div>
		</>
	);
};

interface NavItemProps {
	icon: React.ElementType;
	path: string;
	children: ReactNode;
	onClick?: () => void;
}

const NavLink = ({ icon: Icon, path, children, onClick }: NavItemProps) => {
	const [isActive] = useRoute(path);

	return (
		<WouterLink href={path} onClick={onClick}>
			<a
				className={cn(
					"flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
					isActive
						? "bg-muted text-primary"
						: "text-muted-foreground"
				)}
			>
				<Icon className="h-4 w-4" />
				{children}
			</a>
		</WouterLink>
	);
};

// Helper Link component since wouter's Link renders an anchor tag but we might want custom styling or handling
const Link = ({ to, children, className }: { to: string, children: ReactNode, className?: string }) => (
	<WouterLink href={to}>
		<a className={className}>{children}</a>
	</WouterLink>
)
