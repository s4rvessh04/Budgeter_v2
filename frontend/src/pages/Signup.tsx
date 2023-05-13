import React, { FormEvent } from "react";
import { useMutation } from "react-query";
import { useLocation } from "wouter";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
	Box,
	Button,
	Container,
	FormControl,
	FormLabel,
	Heading,
	HStack,
	Icon,
	Image,
	Input,
	InputGroup,
	InputRightElement,
	Stack,
	Text,
	useBreakpointValue,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";

import { axiosRequest } from "../utils";
import viteSvg from "../../public/vite.svg";
import loginBackground from "../assets/login-background.jpg";
import { Cookies } from "react-cookie";

export const Signup = () => {
	const toast = useToast();
	const cookies = new Cookies();

	const [, setLocation] = useLocation();
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
				status: "success",
				duration: 2500,
				isClosable: true,
			});
			setTimeout(() => {
				setLocation("/login");
			}, 2500);
		},
		onError(err: any) {
			toast({
				title: "Validation Error!",
				description: "Please enter valid details.",
				status: "error",
				duration: 9000,
				isClosable: true,
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
		<Box
			minH={"100vh"}
			minW="100vw"
			position="relative"
			overflowY={"hidden"}
		>
			<Box
				position="absolute"
				w={"full"}
				overflowY="auto"
				bgGradient={
					"linear(to-b, whiteAlpha.400, whiteAlpha.50, whiteAlpha.400)"
				}
				minH={"100vh"}
				minW={"100vw"}
			>
				<Container
					position={"absolute"}
					left={0}
					right={0}
					maxW={"md"}
					m="auto"
				>
					<Stack
						spacing="6"
						mt={{ base: 10, md: 20 }}
						color="gray.900"
					>
						<Image src={viteSvg} h="80px" />
						<Stack
							spacing={{ base: "2", md: "3" }}
							textAlign="center"
						>
							<Heading
								fontWeight={"semibold"}
								size={useBreakpointValue({
									base: "xs",
									md: "xl",
								})}
							>
								Create your account
							</Heading>
							<HStack spacing="1" justify="center">
								<Text color="muted">
									Already have an account?
								</Text>
								<Button
									variant="link"
									colorScheme="blue"
									border={"none"}
									_hover={{
										outline: "none",
										border: "none",
										color: "blue.600",
									}}
									onClick={() => setLocation("/login")}
								>
									Log in
								</Button>
							</HStack>
						</Stack>
					</Stack>
					<Box
						shadow={"lg"}
						rounded="xl"
						my={5}
						px={5}
						py={8}
						w="full"
						bgColor={useColorModeValue("white", "gray.800")}
					>
						<form onSubmit={onSubmit}>
							<input
								type="hidden"
								name="csrfmiddlewaretoken"
								value={cookies.get("csrftoken")}
							/>
							<HStack spacing="4" mb={8}>
								<FormControl isRequired>
									<FormLabel
										fontSize={"sm"}
										color={useColorModeValue(
											"gray.700",
											"white"
										)}
									>
										First Name
									</FormLabel>
									<Input
										type={"text"}
										name="first_name"
										onChange={(e) =>
											setFirstName(e.target.value)
										}
									/>
								</FormControl>
								<FormControl isRequired>
									<FormLabel
										fontSize={"sm"}
										color={useColorModeValue(
											"gray.700",
											"white"
										)}
									>
										Last Name
									</FormLabel>
									<Input
										type={"text"}
										name="last_name"
										onChange={(e) =>
											setLastName(e.target.value)
										}
									/>
								</FormControl>
							</HStack>
							<FormControl mb={8} isRequired>
								<FormLabel
									fontSize={"sm"}
									color={useColorModeValue(
										"gray.700",
										"white"
									)}
								>
									Email
								</FormLabel>
								<Input
									type={"email"}
									name="email"
									onChange={(e) => setEmail(e.target.value)}
								/>
							</FormControl>
							<FormControl mb={8} isRequired>
								<FormLabel
									fontSize={"sm"}
									color={useColorModeValue(
										"gray.700",
										"white"
									)}
								>
									Username
								</FormLabel>
								<Input
									type="text"
									name="username"
									onChange={(e) =>
										setUsername(e.target.value)
									}
								/>
							</FormControl>
							<FormControl mb={8} isRequired>
								<FormLabel
									fontSize={"sm"}
									color={useColorModeValue(
										"gray.700",
										"white"
									)}
								>
									Password
								</FormLabel>
								<InputGroup size="md">
									<Input
										type={
											viewPassword ? "text" : "password"
										}
										name="password"
										onChange={(e) =>
											setPassword(e.target.value)
										}
									/>
									<InputRightElement>
										<Icon
											as={
												viewPassword
													? FaEyeSlash
													: FaEye
											}
											onClick={toggleViewPass}
										/>
									</InputRightElement>
								</InputGroup>
							</FormControl>
							<Button
								isLoading={mutation.isLoading}
								type="submit"
								w="full"
								colorScheme={"telegram"}
								mt={0}
							>
								Create Account
							</Button>
						</form>{" "}
					</Box>
				</Container>
			</Box>
			<Image
				src={loginBackground}
				objectFit="cover"
				objectPosition={"center"}
				color="white"
				minH="100vh"
				h="100vh"
				w="full"
			/>
		</Box>
	);
};
