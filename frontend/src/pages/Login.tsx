import React, { FormEvent } from "react";
import { useMutation } from "react-query";
import { useLocation } from "wouter";
import { useForm, SubmitHandler } from "react-hook-form";
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

import { axiosLogin } from "../utils";
import viteSvg from "../../public/vite.svg";
import loginBackground from "../assets/login-background.jpg";

interface ILoginInput {
	username: string;
	password: string;
}

export const Login = () => {
	const toast = useToast();

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
				status: "success",
				duration: 2500,
				isClosable: true,
			});
			setTimeout(() => {
				setLocation("/home");
			}, 2500);
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
			} else {
				toast({
					title: "Something went wrong!",
					description: err.response.data.detail,
					status: "error",
					duration: 9000,
					isClosable: true,
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
		<Box minH={"100vh"} minW="100vw" position="relative">
			<Box position="absolute" w={"full"} minH={"full"}>
				<Container
					position={"absolute"}
					left={0}
					right={0}
					w="full"
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
								Log in to your account
							</Heading>
							<HStack spacing="1" justify="center">
								<Text color="muted">
									Don't have an account?
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
									onClick={() => setLocation("/signup")}
								>
									Sign up
								</Button>
							</HStack>
						</Stack>
					</Stack>
					<Box
						shadow={"lg"}
						rounded="xl"
						mt={5}
						px={5}
						py={8}
						w="full"
						bgColor={useColorModeValue("white", "gray.800")}
					>
						<form onSubmit={handleSubmit(onSubmit)}>
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
									{...register("username", {
										required: true,
									})}
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
										{...register("password", {
											required: true,
										})}
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
								Login
							</Button>
						</form>{" "}
					</Box>
				</Container>{" "}
			</Box>
			<Image
				src={loginBackground}
				objectFit="cover"
				objectPosition={"center"}
				color="white"
				h="100vh"
				w="full"
			/>
		</Box>
	);
};
