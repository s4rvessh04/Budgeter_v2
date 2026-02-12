import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useLocation } from "wouter";
import { Eye, EyeOff } from "lucide-react";

import { Navbar } from "../components";
import { axiosLogout, axiosRequest } from "../utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface IFormData {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	password: string;
}

export const Settings = () => {
	const { toast } = useToast();
	const queryClient = useQueryClient();
	const [, setLocation] = useLocation();
	const [viewPassword, setViewPassword] = useState<boolean>(false);

	function toggleViewPass() {
		setViewPassword(!viewPassword);
	}

	const { data, isLoading } = useQuery(
		"currentUser",
		() => axiosRequest.get("/users/whoami/").then((res) => res.data),
		{ refetchOnWindowFocus: false }
	);

	const {
		reset,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormData>({
		defaultValues: {
			first_name: "",
			last_name: "",
			username: "",
			email: "",
		},
		mode: "onBlur",
	});

	const logoutMutation = useMutation({
		mutationFn: () => axiosLogout.post("/logout/"),
		onSuccess({ data }) {
			toast({
				title: "Logout Successful!",
				description: data.detail,
				variant: "default",
			});
			setLocation("/login");
		},
		onError(err: any) {
			toast({
				title: "Error Occurred!",
				description: JSON.stringify(err?.response?.data ?? "An unexpected error occurred."),
				variant: "destructive",
			});
		},
	});

	const mutation = useMutation({
		mutationFn: (formData: IFormData) =>
			axiosRequest.put(`/users/${data.username}/update/`, formData),
		onSuccess: () => {
			toast({
				title: "Update Successful!",
				description: "Data updated successfully.",
				variant: "default",
			});
		},
		onError: (err: any) => {
			Object.entries(err.response.data).forEach(([key, value]) => {
				// type assertion for value if needed, assuming string
				toast({
					title: "Error " + key,
					description: value as string,
					variant: "destructive",
				});
			});
		},
	});

	const handleFormSubmit: SubmitHandler<IFormData> = (formData) => {
		// Filter out empty strings
		const cleanedData: any = {};
		Object.keys(formData).forEach((key) => {
			const val = formData[key as keyof IFormData];
			if (val !== "") {
				cleanedData[key] = val;
			}
		});

		const hasPasswordField = Object.keys(cleanedData).includes("password");

		if (hasPasswordField) {
			logoutMutation.mutate();
			toast({
				title: "Password Changed!",
				description: "Please login again.",
				variant: "default",
			});
		}

		if (!isLoading && Object.keys(cleanedData).length > 0) {
			mutation.mutate(cleanedData);
		}
		reset();
		queryClient.invalidateQueries("currentUser");
	};

	return (
		<Navbar>
			<div className="container mx-auto p-4 max-w-4xl py-12">
				<h1 className="text-2xl font-bold mb-6">Account Settings</h1>

				<div className="rounded-xl border bg-card text-card-foreground shadow px-6 py-4">
					<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">

						<div className="grid w-full items-center gap-4 grid-cols-1 md:grid-cols-4">
							<Label className="text-lg md:col-span-1">Name</Label>
							<div className="flex gap-4 md:col-span-3">
								<Input
									{...register("first_name")}
									placeholder={data?.full_name.split(" ")[0]}
									className="flex-1"
								/>
								<Input
									{...register("last_name")}
									placeholder={data?.full_name.split(" ")[1]}
									className="flex-1"
								/>
							</div>
						</div>

						<div className="h-px bg-border" />

						<div className="grid w-full items-center gap-4 grid-cols-1 md:grid-cols-4">
							<Label className="text-lg md:col-span-1">Username</Label>
							<div className="md:col-span-3">
								<Input
									{...register("username")}
									placeholder={data?.username}
								/>
							</div>
						</div>

						<div className="h-px bg-border" />

						<div className="grid w-full items-center gap-4 grid-cols-1 md:grid-cols-4">
							<Label className="text-lg md:col-span-1">Email</Label>
							<div className="md:col-span-3">
								<Input
									{...register("email")}
									type="email"
									placeholder={data?.email}
								/>
							</div>
						</div>

						<div className="h-px bg-border" />

						<div className="grid w-full items-center gap-4 grid-cols-1 md:grid-cols-4">
							<Label className="text-lg md:col-span-1">Password</Label>
							<div className="relative md:col-span-3">
								<Input
									{...register("password")}
									type={viewPassword ? "text" : "password"}
									placeholder="New password"
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
									<span className="sr-only">Toggle password visibility</span>
								</Button>
							</div>
						</div>

						<div className="flex justify-end pt-4">
							<Button type="submit">Save Changes</Button>
						</div>
					</form>
				</div>
			</div>
		</Navbar>
	);
};
