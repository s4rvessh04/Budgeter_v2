import React, { FormEvent } from "react";
import { useMutation } from "react-query";
import { useLocation } from "wouter";
import { Eye, EyeOff, Wallet } from "lucide-react";
import { Cookies } from "react-cookie";

import { cn } from "@/lib/utils";
import { axiosRequest } from "../utils";
import loginBackground from "../assets/login-background.jpg";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export const Signup = () => {
	const { toast } = useToast();
	const cookies = new Cookies();
	const [, setLocation] = useLocation();

	// Local state for form inputs (keeping it simple as per original)
	const [username, setUsername] = React.useState<string>("");
	const [password, setPassword] = React.useState<string>("");
	const [firstName, setFirstName] = React.useState<string>("");
	const [lastName, setLastName] = React.useState<string>("");
	const [email, setEmail] = React.useState<string>("");
	const [viewPassword, setViewPassword] = React.useState<boolean>(false);

	const mutation = useMutation({
		mutationFn: () =>
			axiosRequest.post("/auth/signup/", {
				username: username,
				password: password,
				first_name: firstName,
				last_name: lastName,
				email: email,
			}),
		onSuccess(data, variables, context) {
			toast({
				title: "Account Created!",
				description: "Login to continue...",
				variant: "default",
			});
			setTimeout(() => {
				setLocation("/login");
			}, 2500);
		},
		onError(err: any) {
			toast({
				title: "Validation Error!",
				description: "Please enter valid details.",
				variant: "destructive",
			});
		},
	});

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		mutation.mutate();
	}

	function toggleViewPass() {
		setViewPassword(!viewPassword);
	}

	return (
		<div className="relative min-h-screen w-full lg:grid lg:grid-cols-2 lg:px-0">
			<div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
				<div
					className="absolute inset-0 bg-zinc-900"
					style={{
						backgroundImage: `url(${loginBackground})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
					}}
				/>
				<div className="absolute inset-0 bg-black/40" />
				<div className="relative z-20 flex items-center text-lg font-medium">
					<Wallet className="mr-2 h-7 w-7 text-white/80" />
					Budgeter
				</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							&ldquo;Join thousands who manage their money smarter. Your financial clarity starts here.&rdquo;
						</p>
					</blockquote>
				</div>
			</div>
			<div className="flex min-h-screen items-center justify-center p-6 lg:min-h-0 lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							Create an account
						</h1>
						<p className="text-sm text-muted-foreground">
							Enter your details below to create your account
						</p>
					</div>
					<Card className="border-0 shadow-none">
						<CardContent className="grid gap-4 p-0">
							<form onSubmit={onSubmit}>
								<input
									type="hidden"
									name="csrfmiddlewaretoken"
									value={cookies.get("csrftoken")}
								/>
								<div className="grid gap-4">
									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-2">
											<Label htmlFor="first_name">First Name</Label>
											<Input
												id="first_name"
												type="text"
												onChange={(e) => setFirstName(e.target.value)}
												required
											/>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="last_name">Last Name</Label>
											<Input
												id="last_name"
												type="text"
												onChange={(e) => setLastName(e.target.value)}
												required
											/>
										</div>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="email">Email</Label>
										<Input
											id="email"
											type="email"
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="username">Username</Label>
										<Input
											id="username"
											type="text"
											onChange={(e) => setUsername(e.target.value)}
											required
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="password">Password</Label>
										<div className="relative">
											<Input
												id="password"
												type={viewPassword ? "text" : "password"}
												onChange={(e) => setPassword(e.target.value)}
												required
											/>
											<Button
												type="button"
												variant="ghost"
												size="icon"
												className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
												onClick={toggleViewPass}
											>
												{viewPassword ? (
													<EyeOff className="h-4 w-4 text-muted-foreground" />
												) : (
													<Eye className="h-4 w-4 text-muted-foreground" />
												)}
											</Button>
										</div>
									</div>
									<Button disabled={mutation.isLoading} type="submit">
										{mutation.isLoading && (
											<span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
										)}
										Create Account
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
					<div className="px-8 text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<Button
							variant="link"
							className="px-0 underline underline-offset-4"
							onClick={() => setLocation("/login")}
						>
							Login
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
