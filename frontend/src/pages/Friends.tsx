import React from "react";
import {
	Avatar,
	Box,
	Container,
	Flex,
	FormControl,
	Grid,
	GridItem,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	SimpleGrid,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import { FiSearch, FiUserMinus } from "react-icons/fi";
import { Navbar } from "../components";

export const Friends = () => {
	const [friends, setFriends] = React.useState<any[]>();

	React.useEffect(() => {
		setFriends(createData(3 * 10));
		return;
	}, []);

	function createData(count: number) {
		let items: any[] = [];

		for (let i = 0; i < count; i++) {
			items.push({
				name: faker.name.fullName(),
				username: faker.internet.userName(),
			});
		}
		return items;
	}
	return (
		<Navbar>
			<Container
				maxW={{ base: "container.lg", xl: "container.xl" }}
				px={{ base: 2, md: 4, lg: 4 }}
			>
				<FormControl
					w={{ base: "full", lg: "50%" }}
					m="auto"
					mb={{ base: "4", lg: "6" }}
				>
					<InputGroup>
						<InputLeftElement
							pointerEvents={"none"}
							children={<FiSearch />}
						/>
						<Input
							placeholder="Search friends"
							bg={useColorModeValue("white", "gray.800")}
							border="1px"
							borderColor={useColorModeValue(
								"gray.200",
								"gray.700"
							)}
						/>
					</InputGroup>
				</FormControl>
				<Grid
					templateColumns={{
						base: "repeat(1, 1fr)",
						lg: "repeat(3, 1fr)",
					}}
					gap={{ base: 2, lg: 4 }}
				>
					{friends?.map((val, idx) => (
						<GridItem
							key={idx}
							display={"flex"}
							border={"1px"}
							borderColor={useColorModeValue(
								"gray.200",
								"gray.700"
							)}
							rounded="lg"
							justifyContent="space-between"
							alignItems="center"
							px="4"
							py="4"
							bg={useColorModeValue("white", "gray.800")}
						>
							<Flex gap={2}>
								<Avatar
									name={val.name}
									src="https://bit.ly/broken-link"
								/>
								<Box>
									<Text
										fontSize={"lg"}
										fontWeight="semibold"
										color={useColorModeValue(
											"gray.900",
											"white"
										)}
									>
										{val.name}
									</Text>
									<Text fontSize={"smaller"} color="gray.500">
										@{val.username}
									</Text>
								</Box>
							</Flex>
							<IconButton
								aria-label="user-minus"
								colorScheme="red"
								variant="ghost"
								icon={<FiUserMinus />}
							/>
						</GridItem>
					))}
				</Grid>
			</Container>
		</Navbar>
	);
};
