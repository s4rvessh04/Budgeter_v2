import {
	Box,
	Button,
	Flex,
	Heading,
	HStack,
	Image,
	Stack,
	Text,
} from "@chakra-ui/react";
import { useLocation } from "wouter";
import viteSvg from "../../public/vite.svg";
import heroBackgroundImage from "../assets/hero-background.jpg";

export const Landing = () => {
	const [, setLocation] = useLocation();

	return (
		<Box minH={"100vh"} minW={"100vw"} maxW={"100vw"} position={"relative"}>
			<Stack
				position="absolute"
				w={"full"}
				bgGradient={
					"linear(to-b, blackAlpha.600, blackAlpha.500, blackAlpha.300)"
				}
				color="white"
				minH={"full"}
			>
				<HStack justifyContent={"space-between"} py="2" px="4">
					<HStack>
						<Image src={viteSvg} h="20px" />
						<Text fontFamily={"monospace"} fontWeight="semibold">
							Budgeter
						</Text>
					</HStack>
					<HStack spacing={"4"}>
						{/* <ThemeToggler
							aria-label="theme-toggler"
							variant={"ghost"}
							colorScheme={"blackAlpha"}
							color="white"
						/> */}
						<Button
							onClick={() => setLocation("/signup")}
							variant="ghost"
							colorScheme={"blackAlpha"}
							color="white"
						>
							Sign Up
						</Button>
						<Button
							onClick={() => setLocation("/login")}
							colorScheme={"blackAlpha"}
							color="white"
							variant="solid"
						>
							Login
						</Button>
					</HStack>
				</HStack>
				<Flex
					flexDir={"column"}
					py="2"
					px="4"
					flex={1}
					justifyContent={"center"}
				>
					<Stack textAlign={"center"} spacing={2}>
						<Heading size={"3xl"} fontFamily="body">
							Budgeting made simple.
						</Heading>
						<Heading
							size={"lg"}
							fontWeight="semibold"
							color={"whiteAlpha.600"}
							fontFamily="body"
						>
							We help manage your expenses.
						</Heading>
					</Stack>
				</Flex>
			</Stack>
			<Image
				src={heroBackgroundImage}
				objectFit="cover"
				objectPosition={"top"}
				h="100vh"
				// h="full"
				w="full"
			/>
		</Box>
	);
};
