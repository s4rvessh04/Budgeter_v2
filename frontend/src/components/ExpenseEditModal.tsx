import React from "react";
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
	Select,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Icon,
	Grid,
	GridItem,
} from "@chakra-ui/react";
import { FiChevronDown, FiUser, FiUsers } from "react-icons/fi";
import { parseAmount, parseDate } from "../utils";
import { IExpense, ISharedExpense } from "../types";

interface Props {
	onClose: () => void;
	isOpen: boolean;
	data: IExpense | undefined;
}

export const ExpenseEditModal = ({ onClose, isOpen, data }: Props) => {
	const toast = useToast();
	const dateTime = parseDate(data!?.date_time);

	const [sharedExpenses, setSharedExpenses] = React.useState<
		ISharedExpense[]
	>(data!?.shared_expenses);

	React.useEffect(() => {
		setSharedExpenses(data!?.shared_expenses);
		console.log(data);
		return;
	}, [data]);

	function handleSharedExpUserCount(type: "inc" | "dec"): void {
		if (type === "inc") {
			setSharedExpenses([
				...sharedExpenses,
				{
					id: "0",
					expense_id: "0",
					last_update: "0",
					main_user_id: "0",
					shared_user_amount: 0,
					shared_user_id: "0",
					status: "UP",
				},
			]);
		} else {
			sharedExpenses.pop();
			setSharedExpenses([...sharedExpenses]);
		}
	}

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Edit Expense</ModalHeader>
					<ModalCloseButton _focus={{ outline: "none" }} />
					<ModalBody pb={6}>
						<Flex justify={"space-between"} alignItems={"center"}>
							<Box
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
							</Box>
							<Box>
								<Tag
									size={"md"}
									variant="subtle"
									rounded={"full"}
									colorScheme="telegram"
								>
									<TagLeftIcon boxSize="12px">
										{data?.is_shared ? (
											<FiUsers size={"24px"} />
										) : (
											<FiUser size={"24px"} />
										)}
									</TagLeftIcon>
									<TagLabel>
										{data?.is_shared ? "Shared" : "Self"}
									</TagLabel>
								</Tag>
							</Box>
						</Flex>
						<FormControl mt={4}>
							<FormLabel>Description</FormLabel>
							<Input
								defaultValue={data?.description}
								placeholder="Enter description"
								required
							/>
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Amount</FormLabel>
							<NumberInput value={data?.amount} step={100}>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
						</FormControl>
						{data?.is_shared && sharedExpenses?.length !== 0 ? (
							<FormControl isRequired mt={4}>
								<FormLabel>With</FormLabel>
								{sharedExpenses?.map((sharedExpense, idx) => (
									<Grid
										gap="4"
										mb="4"
										key={idx}
										templateColumns={"repeat(6, 1fr)"}
									>
										<GridItem
											colSpan={3}
											display="flex"
											alignItems="center"
											justifyContent={"start"}
										>
											<Select
												defaultValue={
													sharedExpense.shared_user_id
												}
											>
												<option>
													{
														sharedExpense.shared_user_id
													}
												</option>
											</Select>
										</GridItem>
										<GridItem
											colSpan={2}
											display="flex"
											alignItems="center"
											justifyContent={"start"}
										>
											<NumberInput
												step={100}
												defaultValue={
													sharedExpense.shared_user_amount
												}
												min={0}
											>
												<NumberInputField />
												<NumberInputStepper>
													<NumberIncrementStepper />
													<NumberDecrementStepper />
												</NumberInputStepper>
											</NumberInput>
										</GridItem>
										<GridItem
											colSpan={1}
											display="flex"
											alignItems="center"
											justifyContent={"end"}
										>
											<Menu>
												<MenuButton
													p="2"
													as={Button}
													color={useColorModeValue(
														"white",
														"gray.700"
													)}
													_hover={{
														bg:
															sharedExpense?.status ===
															"P"
																? useColorModeValue(
																		"green.600",
																		"green.300"
																  )
																: useColorModeValue(
																		"red.600",
																		"red.300"
																  ),
													}}
													_active={{
														bg:
															sharedExpense?.status ===
															"UP"
																? useColorModeValue(
																		"green.600",
																		"green.300"
																  )
																: useColorModeValue(
																		"red.600",
																		"red.300"
																  ),
													}}
													bg={
														sharedExpense?.status ===
														"P"
															? useColorModeValue(
																	"green.500",
																	"green.200"
															  )
															: useColorModeValue(
																	"red.500",
																	"red.200"
															  )
													}
												>
													<Icon
														as={FiChevronDown}
														size="4"
														boxSize={"4"}
														mt="1"
													/>
												</MenuButton>
												<MenuList px="2">
													<MenuItem
														rounded={"md"}
														border="none"
														_hover={{
															border: "none",
														}}
													>
														Mark{" "}
														{sharedExpense?.status ===
														"P"
															? "Unpaid"
															: "Paid"}
													</MenuItem>
													<MenuItem
														color={useColorModeValue(
															"red.600",
															"red.300"
														)}
														rounded={"md"}
														border="none"
														_hover={{
															border: "none",
														}}
														onClick={() =>
															handleSharedExpUserCount(
																"dec"
															)
														}
													>
														Remove
													</MenuItem>
												</MenuList>
											</Menu>
										</GridItem>
									</Grid>
								))}
								<Flex>
									<Button
										w={"full"}
										variant="ghost"
										colorScheme={"blue"}
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
