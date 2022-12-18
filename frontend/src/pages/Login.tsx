import React, { FormEvent } from "react";
import { useMutation } from "react-query";
import { useLocation } from "wouter";
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	useToast,
} from "@chakra-ui/react";

import { axiosLogin } from "../utils";

export const Login = () => {
	const toast = useToast();

	const [location, setLocation] = useLocation();
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");

	const mutation = useMutation({
		mutationFn: () =>
			axiosLogin.post(
				"/login/",
				{},
				{ auth: { username: username, password: password } }
			),
		onSuccess(data, variables, context) {
			setLocation("/home");
		},
		onError(err: any) {
			if (err.response.status === 401) {
				toast({
					title: "Wrong Credentials!",
					description: "Please enter valid credentials.",
					status: "error",
					duration: 9000,
					isClosable: true,
				});
			}
		},
	});

	function onSubmit(e: FormEvent) {
		e.preventDefault();
		mutation.mutate();
	}

	return (
		<div>
			<h1>Login Page</h1>
			<form onSubmit={onSubmit}>
				<FormControl>
					<FormLabel>Username</FormLabel>
					<Input
						type="text"
						name="username"
						onChange={(e) => setUsername(e.target.value)}
					/>
				</FormControl>
				<FormControl>
					<FormLabel>Password</FormLabel>
					<Input
						type="password"
						name="password"
						onChange={(e) => setPassword(e.target.value)}
					/>
				</FormControl>
				<Button type="submit">Login</Button>
			</form>
		</div>
	);
};
