import React from "react";
import { Navbar } from "../components";
import {
	Box,
	Button,
	Container,
	Divider,
	FormControl,
	Grid,
	GridItem,
	Icon,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { axiosLogout, axiosRequest } from "../utils";
import { useLocation } from "wouter";

interface IFormData {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	password: string;
}

export const Settings = () => {
	const toast = useToast();
	const queryClient = useQueryClient();

	const [, setLocation] = useLocation();
	const [viewPassword, setViewPassword] = React.useState<boolean>(false);

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
				status: "success",
				duration: 3500,
				isClosable: true,
			});
			setLocation("/login");
		},
		onError(err) {
			toast({
				title: "Error Occured!",
				description: JSON.stringify(err.response.data),
				status: "error",
				duration: 5000,
				isClosable: true,
			});
			return;
		},
	});

	const mutation = useMutation({
		mutationFn: (formData: IFormData) =>
			axiosRequest.put(`/users/${data.username}/update/`, formData),
		onSuccess: () => {
			toast({
				title: "Update Successful!",
				description: "Data updated successfully.",
				status: "success",
				duration: 4000,
				isClosable: true,
			});
		},
		onError: (err: any) => {
			Object.entries(err.response.data).forEach(([key, value]) => {
				toast({
					title: "Error " + key,
					description: value,
					status: "error",
					duration: 5000,
					isClosable: true,
				});
			});
			return;
		},
	});

	const handleFormSubmit: SubmitHandler<IFormData> = (data) => {
		Object.keys(data).forEach((key) => data[key] === "" && delete data[key]);

		const hasPasswordField = Object.keys(data).includes("password");

		if (hasPasswordField) {
			logoutMutation.mutate();
			toast({
				title: "Password Changed!",
				description: "Please login again.",
				status: "success",
				duration: 3500,
				isClosable: true,
			});
		}
		if (!isLoading) {
			mutation.mutate(data);
		}
		reset();
		queryClient.invalidateQueries("currentUser");
	};

	return (
		<Navbar>
			<Container
				minW={{
					base: "container.sm",
					lg: "container.md",
					xl: "container.xl",
				}}
				minH={{ xl: "100vh", base: "full" }}
				maxW={"full"}
				display={"flex"}
				flexDirection={"column"}
				px={{ base: 2, md: 4, lg: 12 }}
				py={{ base: 2, md: 4, lg: 12 }}
			>
				<Text fontSize={"2xl"} fontWeight={"bold"} mb={4}>
					Account Settings
				</Text>
				<Box
					bg={useColorModeValue("white", "gray.800")}
					border={"1px"}
					borderColor={useColorModeValue("gray.200", "gray.700")}
					borderRadius={"xl"}
					px={6}
				>
					<form onSubmit={handleSubmit(handleFormSubmit)}>
						<Grid
							gap={4}
							my={6}
							templateColumns={"repeat(2, 1fr)"}
							alignItems={"center"}
						>
							<GridItem>
								<Text fontSize={"lg"} fontWeight={"semibold"}>
									Name
								</Text>
							</GridItem>
							<GridItem display={"flex"} gap={5}>
								<FormControl>
									{/* <FormLabel>First Name</FormLabel> */}
									<Input
										{...register("first_name")}
										type="text"
										bg={useColorModeValue("white", "gray.900")}
										variant={"outline"}
										placeholder={data?.full_name.split(" ")[0]}
									/>
								</FormControl>
								<FormControl>
									{/* <FormLabel>Last Name</FormLabel> */}
									<Input
										{...register("last_name")}
										type="text"
										bg={useColorModeValue("white", "gray.900")}
										placeholder={data?.full_name.split(" ")[1]}
									/>
								</FormControl>
							</GridItem>
						</Grid>
						<Divider borderColor={useColorModeValue("gray.300", "gray.700")} />
						<Grid
							gap={4}
							my={6}
							templateColumns={"repeat(2, 1fr)"}
							alignItems={"center"}
						>
							<GridItem>
								<Text fontSize={"lg"} fontWeight={"semibold"}>
									Username
								</Text>
							</GridItem>
							<GridItem display={"flex"} gap={5}>
								<FormControl>
									{/* <FormLabel>Last Name</FormLabel> */}
									<Input
										{...register("username")}
										type="text"
										bg={useColorModeValue("white", "gray.900")}
										placeholder={data?.username}
									/>
								</FormControl>
							</GridItem>
						</Grid>
						<Divider borderColor={useColorModeValue("gray.300", "gray.700")} />
						<Grid
							gap={4}
							my={6}
							templateColumns={"repeat(2, 1fr)"}
							alignItems={"center"}
						>
							<GridItem>
								<Text fontSize={"lg"} fontWeight={"semibold"}>
									Email
								</Text>
							</GridItem>
							<GridItem display={"flex"} gap={5}>
								<FormControl>
									{/* <FormLabel>Last Name</FormLabel> */}
									<Input
										{...register("email")}
										type="email"
										bg={useColorModeValue("white", "gray.900")}
										placeholder={data?.email}
									/>
								</FormControl>
							</GridItem>
						</Grid>
						<Divider borderColor={useColorModeValue("gray.300", "gray.700")} />
						<Grid
							gap={4}
							my={6}
							templateColumns={"repeat(2, 1fr)"}
							alignItems={"center"}
						>
							<GridItem>
								<Text fontSize={"lg"} fontWeight={"semibold"}>
									Password
								</Text>
							</GridItem>
							<GridItem display={"flex"} gap={5}>
								<FormControl mb={8}>
									<InputGroup size="md">
										<Input
											{...register("password")}
											type={viewPassword ? "text" : "password"}
											placeholder="New password"
											bg={useColorModeValue("white", "gray.900")}
										/>
										<InputRightElement>
											<Icon
												as={viewPassword ? FaEyeSlash : FaEye}
												onClick={toggleViewPass}
											/>
										</InputRightElement>
									</InputGroup>
								</FormControl>
							</GridItem>
						</Grid>
						<Grid
							gap={4}
							my={6}
							templateColumns={"repeat(2, 1fr)"}
							alignItems={"center"}
						>
							<GridItem></GridItem>
							<GridItem
								display={"flex"}
								gap={5}
								alignItems={"end"}
								justifyContent={"end"}
							>
								<Button variant={"solid"} colorScheme="blue" type="submit">
									Save Changes
								</Button>
							</GridItem>
						</Grid>
					</form>
				</Box>
			</Container>
		</Navbar>
	);
};
