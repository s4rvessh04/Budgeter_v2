import React, { useEffect } from "react";
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberDecrementStepper,
	NumberIncrementStepper,
	Text,
	Tag,
	TagLeftIcon,
	TagLabel,
	Flex,
	useColorModeValue,
	Box,
	useToast,
	IconButton,
	Select,
} from "@chakra-ui/react";
import { FiUser, FiUsers, FiX } from "react-icons/fi";
import { parseAmount, parseDate } from "../utils";

type displayData = {
	dateTime: string;
	description: string;
	amount: string;
	isShared: boolean;
};

interface Props {
	onClose: () => void;
	isOpen: boolean;
	displayData: displayData;
}

export const ExpenseEditModal = ({ onClose, isOpen, displayData }: Props) => {
	const parse = (val: string) => val.replace(/^\$/, "");

	const toast = useToast();
	const [value, setValue] = React.useState(displayData?.amount);

	const dateTime = parseDate(displayData!?.dateTime);

	useEffect(() => {
		setValue(displayData?.amount);
	}, [displayData]);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Edit Expense</ModalHeader>
					<ModalCloseButton _focus={{ outline: "none" }} />
					<ModalBody pb={6}>
						<Flex justify={"space-between"} alignItems={"center"}>
							<Text
								fontWeight={"semibold"}
								sx={{
									fontVariantNumeric: "proportional-nums",
									verticalAlign: "baseline",
								}}
							>
								<Text fontSize={"md"}>{dateTime.date}</Text>
								<Text
									fontSize={"sm"}
									color={useColorModeValue(
										"gray.500",
										"gray.400"
									)}
									mt={0.5}
								>
									{dateTime.time}
								</Text>
							</Text>
							<Box>
								<Tag
									size={"md"}
									variant="subtle"
									rounded={"full"}
									colorScheme="telegram"
								>
									<TagLeftIcon boxSize="12px">
										{displayData?.isShared ? (
											<FiUsers size={"24px"} />
										) : (
											<FiUser size={"24px"} />
										)}
									</TagLeftIcon>
									<TagLabel>
										{displayData?.isShared
											? "Shared"
											: "Self"}
									</TagLabel>
								</Tag>
							</Box>
						</Flex>

						<FormControl mt={4}>
							<FormLabel>Description</FormLabel>
							<Input placeholder={displayData?.description} />
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Amount</FormLabel>
							<NumberInput
								onChange={(valueString) =>
									setValue(parse(valueString))
								}
								value={parseAmount(value)}
								step={100}
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</FormControl>
						{displayData?.isShared ? (
							<FormControl isRequired mt={4}>
								<FormLabel>With</FormLabel>
								{Array(3)
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
												// onClick={() =>
												// 	handleSharedExpenseUserCount(
												// 		"dec"
												// 	)
												// }
											/>
										</Flex>
									))}
								<Flex>
									<Button
										w={"full"}
										variant="ghost"
										colorScheme={"blue"}
										// onClick={() =>
										// 	handleSharedExpenseUserCount("inc")
										// }
									>
										Add new
									</Button>
								</Flex>
							</FormControl>
						) : (
							""
						)}
					</ModalBody>

					<ModalFooter>
						<Button
							colorScheme="telegram"
							mr={3}
							onClick={() =>
								toast({
									title: `Saved successfully`,
									position: "bottom",
									isClosable: true,
									status: "success",
								}) && onClose()
							}
						>
							Save
						</Button>
						<Button onClick={onClose}>Cancel</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};
