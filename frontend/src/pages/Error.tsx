import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

export const Error = () => {
	const [, setLocation] = useLocation();

	return (
		<div className="flex h-screen w-screen items-center justify-center bg-background text-foreground px-6">
			<div className="flex flex-col items-center space-y-4 text-center sm:flex-row sm:space-x-6 sm:space-y-0 sm:text-left">
				<div className="font-mono text-6xl font-bold text-muted-foreground sm:border-r sm:pr-6">
					404
				</div>
				<div className="space-y-3">
					<h1 className="text-2xl font-semibold">Page not found</h1>
					<p className="text-sm text-muted-foreground">
						The page you're looking for doesn't exist or has been moved.
					</p>
					<Button
						variant="default"
						size="sm"
						onClick={() => setLocation("/")}
						className="mt-2"
					>
						<Home className="mr-2 h-4 w-4" />
						Back to Home
					</Button>
				</div>
			</div>
		</div>
	);
};
