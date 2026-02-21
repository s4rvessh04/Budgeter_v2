import { useLocation } from "wouter";
import heroBackgroundImage from "../assets/hero-background.jpg";
import { Button } from "@/components/ui/button";
import { ArrowRight, PieChart, Users, Wallet } from "lucide-react";

const features = [
	{
		icon: PieChart,
		title: "Track Every Rupee",
		description: "Log expenses in seconds. See where your money goes with clear, organized records.",
	},
	{
		icon: Users,
		title: "Split With Friends",
		description: "Shared dinner? Group trip? Split bills fairly and keep track of who owes what.",
	},
	{
		icon: Wallet,
		title: "Settle Up Easily",
		description: "No more awkward reminders. Settle debts with a tap and stay on good terms.",
	},
];

export const Landing = () => {
	const [, setLocation] = useLocation();

	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			{/* Hero Section */}
			<div className="absolute inset-0 z-10 flex min-h-full w-full flex-col bg-gradient-to-b from-black/70 via-black/50 to-black/80 text-white">
				{/* Top Nav */}
				<nav className="flex items-center justify-between px-5 py-4 md:px-8 lg:px-12">
					<div className="flex items-center gap-2.5">
						<Wallet className="h-6 w-6 text-white/80" />
						<span className="text-lg font-bold tracking-tight">Budgeter</span>
					</div>
					<div className="flex gap-2 sm:gap-3">
						<Button
							variant="ghost"
							size="sm"
							className="text-white/80 hover:bg-white/10 hover:text-white"
							onClick={() => setLocation("/signup")}
						>
							Sign Up
						</Button>
						<Button
							size="sm"
							className="bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10"
							onClick={() => setLocation("/login")}
						>
							Login
						</Button>
					</div>
				</nav>

				{/* Hero Content */}
				<div className="flex flex-1 flex-col items-center justify-center px-5 text-center sm:px-8">
					<div className="max-w-3xl space-y-5 sm:space-y-6">
						<h1 className="font-sans text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
							Your money,{" "}
							<span className="text-white/60">
								your rules.
							</span>
						</h1>
						<p className="mx-auto max-w-xl text-base font-medium leading-relaxed text-white/60 sm:text-lg md:text-xl">
							Track expenses, split bills, and stay on top of your finances — effortlessly.
						</p>
						<div className="flex flex-col items-center gap-3 pt-2 sm:flex-row sm:justify-center">
							<Button
								size="lg"
								className="w-full bg-white text-base font-semibold text-black shadow-lg shadow-white/10 hover:bg-white/90 sm:w-auto sm:px-8"
								onClick={() => setLocation("/signup")}
							>
								Get Started Free
								<ArrowRight className="ml-2 h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="lg"
								className="w-full border-white/20 bg-white/5 text-base text-white backdrop-blur-sm hover:bg-white/10 hover:text-white sm:w-auto sm:px-8"
								onClick={() => setLocation("/login")}
							>
								I have an account
							</Button>
						</div>
					</div>
				</div>

				{/* Features Section */}
				<div className="w-full border-t border-white/10 bg-black/30 backdrop-blur-sm">
					<div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-5 py-8 md:grid-cols-3 md:gap-8 md:px-8 md:py-10">
						{features.map((feature) => (
							<div key={feature.title} className="flex items-start gap-3 md:flex-col md:items-center md:text-center">
								<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 md:h-12 md:w-12">
									<feature.icon className="h-5 w-5 text-white/70 md:h-6 md:w-6" />
								</div>
								<div>
									<h3 className="text-sm font-semibold md:mt-3 md:text-base">{feature.title}</h3>
									<p className="mt-1 text-xs leading-relaxed text-white/50 md:text-sm">
										{feature.description}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Background Image */}
			<img
				src={heroBackgroundImage}
				alt="Hero Background"
				className="absolute inset-0 h-full w-full object-cover object-top"
			/>
		</div>
	);
};
