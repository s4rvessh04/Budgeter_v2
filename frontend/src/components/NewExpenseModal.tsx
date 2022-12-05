import React from "react";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	HStack,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
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
import { FiX } from "react-icons/fi";

interface Props {
	onClose: () => void;
	isOpen: boolean;
}

export const NewExpenseModal = ({ onClose, isOpen }: Props) => {
	const [value, setValue] = React.useState("Self");
	const [sharedExpUserCount, setSharedExpUserCount] = React.useState(0);

	const handleSharedExpUserCount = (type: "inc" | "dec") => {
		if (type === "inc") setSharedExpUserCount(sharedExpUserCount + 1);
		else if (type === "dec") setSharedExpUserCount(sharedExpUserCount - 1);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Expense</ModalHeader>
				<ModalCloseButton _focus={{ outline: "none" }} />
				<ModalBody mb={2}>
					<Flex direction={"column"} gap="5" rounded={"md"}>
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
								{Array(sharedExpUserCount)
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
													handleSharedExpUserCount(
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
											handleSharedExpUserCount("inc")
										}
									>
										Add new
									</Button>
								</Flex>
							</FormControl>
						) : (
							""
						)}

						<Flex
							justifyContent={"space-between"}
							alignItems="center"
						>
							<Box>
								<Text fontSize="md" fontWeight={"medium"}>
									Final Amount
								</Text>
								<Text fontSize="lg" fontWeight={"bold"}>
									{4000}
								</Text>
							</Box>
							<Button colorScheme={"telegram"}>
								Save Expense
							</Button>
						</Flex>
					</Flex>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
