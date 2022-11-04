import {
	Center,
	Container,
	Divider,
	Spacer,
	Stack,
	StackDivider,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";

export const Error = () => {
	return (
		<Container
			maxW="container.xl"
			h={"100vh"}
			minW={"100vw"}
			bg={useColorModeValue("white", "black")}
		>
			<Center maxH={"100vh"} h="full">
				<Stack
					direction="row"
					spacing="2"
					divider={
						<StackDivider
							borderColor={useColorModeValue(
								"gray.300",
								"gray.800"
							)}
						/>
					}
				>
					<Text
						fontFamily={"mono"}
						fontSize={"xl"}
						alignSelf={"center"}
						textColor={useColorModeValue("gray.400", "gray.700")}
					>
						404
					</Text>
					<Text
						fontSize={"2xl"}
						fontWeight={"semibold"}
						textColor={useColorModeValue("gray.900", "white")}
						alignSelf={"center"}
					>
						Page does not exist!
					</Text>
				</Stack>
			</Center>
		</Container>
	);
};
