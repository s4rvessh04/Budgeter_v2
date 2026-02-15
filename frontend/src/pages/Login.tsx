import React from "react";
import { useMutation } from "react-query";
import { useLocation } from "wouter";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { axiosLogin } from "../utils";
import viteSvg from "../../public/vite.svg";
import loginBackground from "../assets/login-background.jpg";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface ILoginInput {
	username: string;
	password: string;
}

export const Login = () => {
	const { toast } = useToast();
	const [, setLocation] = useLocation();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ILoginInput>();

	const [viewPassword, setViewPassword] = React.useState<boolean>(false);

	const mutation = useMutation({
		mutationFn: (data: ILoginInput) => axiosLogin.post("/login/", data),
		onSuccess(data, variables, context) {
			toast({
				title: "Authentication Successful!",
				description: "Redirecting to home page...",
				variant: "default",
			});
			setTimeout(() => {
				setLocation("/home");
			}, 2500);
		},
		onError(err: any) {
			if (err?.response?.status === 401) {
				toast({
					title: "Wrong Credentials!",
					description: "Please enter valid credentials.",
					variant: "destructive",
				});
			} else {
				toast({
					title: "Something went wrong!",
					description:
						err?.response?.data?.detail ?? "An unexpected error occurred.",
					variant: "destructive",
				});
			}
		},
	});

	const onSubmit: SubmitHandler<ILoginInput> = (data) => {
		mutation.mutate(data);
	};

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
				<div className="relative z-20 flex items-center text-lg font-medium">
					<img src={viteSvg} className="mr-2 h-8 w-8" alt="Logo" />
					Budgeter v2
				</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">
							&ldquo;Control your expenses, budget your life.&rdquo;
						</p>
					</blockquote>
				</div>
			</div>
			<div className="lg:p-8 flex items-center justify-center">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">
							Login to your account
						</h1>
						<p className="text-sm text-muted-foreground">
							Enter your credentials below to access your account
						</p>
					</div>
					<Card className="border-0 shadow-none">
						<CardContent className="grid gap-4 p-0">
							<form onSubmit={handleSubmit(onSubmit)}>
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="username">Username</Label>
										<Input
											id="username"
											placeholder="johndoe"
											type="text"
											autoCapitalize="none"
											autoCorrect="off"
											disabled={mutation.isLoading}
											{...register("username", { required: true })}
											className={cn(errors.username && "border-red-500 focus-visible:ring-red-500")}
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="password">Password</Label>
										<div className="relative">
											<Input
												id="password"
												placeholder="••••••••"
												type={viewPassword ? "text" : "password"}
												disabled={mutation.isLoading}
												{...register("password", { required: true })}
												className={cn(errors.password && "border-red-500 focus-visible:ring-red-500")}
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
										Login
									</Button>
								</div>
							</form>
						</CardContent>
					</Card>
					<div className="px-8 text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Button
							variant="link"
							className="px-0 underline underline-offset-4"
							onClick={() => setLocation("/signup")}
						>
							Sign up
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};
