import { useLocation } from "wouter";
import viteSvg from "../../public/vite.svg";
import heroBackgroundImage from "../assets/hero-background.jpg";
import { Button } from "@/components/ui/button";

export const Landing = () => {
	const [, setLocation] = useLocation();

	return (
		<div className="relative min-h-screen w-full overflow-hidden">
			<div className="absolute inset-0 z-10 flex min-h-full w-full flex-col bg-gradient-to-b from-black/60 via-black/50 to-black/30 text-white">
				<div className="flex justify-between px-4 py-4 md:px-8">
					<div className="flex items-center gap-2">
						<img src={viteSvg} alt="Vite Logo" className="h-6 w-auto" />
						<span className="font-mono font-semibold">Budgeter</span>
					</div>
					<div className="flex gap-4">
						<Button
							variant="ghost"
							className="text-white hover:bg-white/20 hover:text-white"
							onClick={() => setLocation("/signup")}
						>
							Sign Up
						</Button>
						<Button
							variant="default"
							className="bg-white/20 text-white hover:bg-white/30"
							onClick={() => setLocation("/login")}
						>
							Login
						</Button>
					</div>
				</div>
				<div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
					<div className="space-y-4">
						<h1 className="font-sans text-5xl font-bold md:text-7xl">
							Budgeting made simple.
						</h1>
						<h2 className="font-sans text-xl font-semibold text-white/60 md:text-2xl">
							We help manage your expenses.
						</h2>
					</div>
				</div>
			</div>
			<img
				src={heroBackgroundImage}
				alt="Hero Background"
				className="absolute inset-0 h-full w-full object-cover object-top"
			/>
		</div>
	);
};
