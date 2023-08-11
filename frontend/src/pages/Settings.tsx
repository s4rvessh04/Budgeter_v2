import React from "react";
import { Navbar } from "../components";
import {
	Box,
	Button,
	Container,
	Divider,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	Icon,
	Input,
	InputGroup,
	InputRightElement,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import { SubmitHandler, useForm } from "react-hook-form";

interface IFormData {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	password: string;
}

export const Settings = () => {
	const [viewPassword, setViewPassword] = React.useState<boolean>(false);

	function toggleViewPass() {
		setViewPassword(!viewPassword);
	}

	const {
		control,
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<IFormData>();

	const handleFormSubmit: SubmitHandler<IFormData> = (data) => {
		console.log(data);
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
					bg={useColorModeValue("gray.200", "gray.800")}
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
										bg={useColorModeValue(
											"white",
											"gray.900"
										)}
										variant={"outline"}
										placeholder="First Name"
									/>
								</FormControl>
								<FormControl>
									{/* <FormLabel>Last Name</FormLabel> */}
									<Input
										{...register("last_name")}
										type="text"
										bg={useColorModeValue(
											"white",
											"gray.900"
										)}
										placeholder="Last Name"
									/>
								</FormControl>
							</GridItem>
						</Grid>
						<Divider
							borderColor={useColorModeValue(
								"gray.300",
								"gray.700"
							)}
						/>
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
										bg={useColorModeValue(
											"white",
											"gray.900"
										)}
										placeholder="Username"
									/>
								</FormControl>
							</GridItem>
						</Grid>
						<Divider
							borderColor={useColorModeValue(
								"gray.300",
								"gray.700"
							)}
						/>
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
										bg={useColorModeValue(
											"white",
											"gray.900"
										)}
										placeholder="email@email.com"
									/>
								</FormControl>
							</GridItem>
						</Grid>
						<Divider
							borderColor={useColorModeValue(
								"gray.300",
								"gray.700"
							)}
						/>
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
											type={
												viewPassword
													? "text"
													: "password"
											}
											placeholder="New password"
											bg={useColorModeValue(
												"white",
												"gray.900"
											)}
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
								<Button
									variant={"solid"}
									colorScheme="blue"
									type="submit"
								>
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
