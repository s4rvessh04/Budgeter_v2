import {
	Box,
	Button,
	Container,
	Flex,
	FormControl,
	FormHelperText,
	FormLabel,
	HStack,
	IconButton,
	Input,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Radio,
	RadioGroup,
	Select,
	Text,
	useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { FiX } from "react-icons/fi";
import { Navbar } from "../components";

export const NewExpense = () => {
	const [value, setValue] = React.useState("Self");
	const [sharedExpenseUserCount, setSharedExpenseUserCount] =
		React.useState(0);

	const handleSharedExpenseUserCount = (type: "inc" | "dec") => {
		if (type === "inc")
			setSharedExpenseUserCount(sharedExpenseUserCount + 1);
		else if (type === "dec")
			setSharedExpenseUserCount(sharedExpenseUserCount - 1);
	};

	return (
		<Navbar>
			<Container
				maxW={{ base: "container.lg", xl: "container.md" }}
				px={{ base: 2, md: 4, lg: 4 }}
				py={{ base: 2, md: 5, lg: 10 }}
			>
				<Flex
					direction={"column"}
					gap="5"
					p="6"
					rounded={"md"}
					bg={useColorModeValue("white", "gray.800")}
					border="1px"
					borderColor={useColorModeValue("gray.200", "gray.700")}
				>
					<FormControl isRequired>
						<FormLabel>Description</FormLabel>
						<Input placeholder="Enter desciption" />
					</FormControl>

					<FormControl isRequired>
						<FormLabel>Amount</FormLabel>
						<NumberInput step={200} defaultValue={0} min={0}>
							<NumberInputField />
							<NumberInputStepper>
								<NumberIncrementStepper />
								<NumberDecrementStepper />
							</NumberInputStepper>
						</NumberInput>
					</FormControl>

					<FormControl as="fieldset">
						<FormLabel as="legend">Type of expense: </FormLabel>
						<RadioGroup
							defaultValue="Self"
							onChange={setValue}
							value={value}
						>
							<HStack spacing="24px">
								<Radio value="Self">Self</Radio>
								<Radio value="Shared">Shared</Radio>
							</HStack>
						</RadioGroup>
					</FormControl>
					{value.toLowerCase() === "shared" ? (
						<FormControl isRequired>
							<FormLabel>With</FormLabel>
							{Array(sharedExpenseUserCount)
								.fill(0)
								.map((key, i) => (
									<Flex gap="4" mb="4">
										<Select>
											<option value="option1">
												Name 1
											</option>
											<option value="option2">
												Name 2
											</option>
											<option value="option3">
												Name 3
											</option>
										</Select>
										<NumberInput
											step={100}
											defaultValue={0}
											min={0}
										>
											<NumberInputField />
											<NumberInputStepper>
												<NumberIncrementStepper />
												<NumberDecrementStepper />
											</NumberInputStepper>
										</NumberInput>
										<IconButton
											aria-label="remove-btn"
											colorScheme={"gray"}
											icon={<FiX />}
											onClick={() =>
												handleSharedExpenseUserCount(
													"dec"
												)
											}
										/>
									</Flex>
								))}
							<Flex>
								<Button
									w={"full"}
									variant="ghost"
									colorScheme={"blue"}
									mt="4"
									onClick={() =>
										handleSharedExpenseUserCount("inc")
									}
								>
									Add new
								</Button>
							</Flex>
						</FormControl>
					) : (
						""
					)}

					<Flex justifyContent={"space-between"} alignItems="center">
						<Box>
							<Text fontSize="md" fontWeight={"medium"}>
								Final Amount
							</Text>
							<Text fontSize="lg" fontWeight={"bold"}>
								{4000}
							</Text>
						</Box>
						<Button colorScheme={"telegram"}>Save Expense</Button>
					</Flex>
				</Flex>
			</Container>
		</Navbar>
	);
};
