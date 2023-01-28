import React from "react";
import { useQuery } from "react-query";
import { faker } from "@faker-js/faker";
import { FiUser, FiUsers } from "react-icons/fi";
import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableContainer,
	Text,
	Skeleton,
	useDisclosure,
	Box,
	Tag,
	TagLeftIcon,
	TagLabel,
	useColorMode,
} from "@chakra-ui/react";
import shallow from "zustand/shallow";

import { ExpenseEditModal } from "./ExpenseEditModal";

import { useExpenseStore } from "../stores";
import { IExpense, ISharedExpense } from "../types";
import {
	axiosRequest,
	handleColorModeValue,
	handleDefault,
	parseDate,
} from "../utils";

export const ExpenseTable = () => {
	const { colorMode } = useColorMode();

	const { isOpen, onOpen, onClose } = useDisclosure();

	const [modalData, setModalData] = React.useState<IExpense>();
	const [sumExpensesAmount, updateSumExpensesAmount] = useExpenseStore(
		(state) => [state.sumExpensesAmount, state.updateSumExpensesAmount],
		shallow
	);

	const { isLoading, error, data, isFetching, status } = useQuery(
		["expenses"],
		() => axiosRequest.get("/expenses/").then((res) => res.data),
		{
			refetchOnWindowFocus: false,
		}
	);

	const calcExpensesSum = React.useCallback(
		(expenses: IExpense[]) =>
			handleDefault<number>(
				parseFloat(
					expenses
						?.reduce(
							(prev: any, curr: any) =>
								prev + parseFloat(curr.amount),
							0
						)
						.toFixed(2)
				),
				0
			),
		[data]
	);

	React.useEffect(() => {
		// setExpenses(createData(10));
		// setLoaded(true);
		if (!isFetching) {
			const expensesSum = calcExpensesSum(data);
			updateSumExpensesAmount(expensesSum);
		}
		return;
	}, [isLoading]);

	// function createData(count: number): IExpense[] {
	// 	let items: IExpense[] = [];

	// 	for (let i = 0; i < count; i++) {
	// 		let expense: IExpense = {
	// 			id: faker.database.mongodbObjectId(),
	// 			user_id: faker.datatype.number().toString(),
	// 			description: faker.finance.transactionDescription(),
	// 			date_time: faker.date.past().toUTCString(),
	// 			last_update: faker.date.recent().toUTCString(),
	// 			amount: parseFloat(faker.finance.amount()),
	// 			is_shared: faker.datatype.boolean(),
	// 			shared_expenses: [],
	// 		};

	// 		let sharedExpenses: ISharedExpense[] = [];

	// 		for (let j = 0; j < parseInt(faker.random.numeric()); j++) {
	// 			sharedExpenses.push({
	// 				id: faker.database.mongodbObjectId(),
	// 				expense_id: expense.id,
	// 				last_update: faker.date.recent().toUTCString(),
	// 				main_user_id: expense.user_id,
	// 				shared_user_id: faker.name.fullName(),
	// 				shared_user_amount: parseFloat(faker.finance.amount()),
	// 				status: faker.datatype.boolean() === true ? "P" : "UP",
	// 			});
	// 		}
	// 		expense.shared_expenses = sharedExpenses;
	// 		items.push(expense);
	// 	}
	// 	return items;
	// }

	function handleModalData(data: IExpense): void {
		console.log(data);
		setModalData(data);
		return onOpen();
	}

	return (
		<>
			<TableContainer h={"full"} overflowY={"auto"}>
				<Table variant="simple" h={"full"}>
					<Thead
						pos={"sticky"}
						top={0}
						bgColor={handleColorModeValue(
							"white",
							"gray.900",
							colorMode
						)}
					>
						{data!?.length > 0 ? (
							<Tr>
								<Th>Date</Th>
								<Th>Description</Th>
								<Th>Type</Th>
								<Th isNumeric>Amount</Th>
							</Tr>
						) : (
							<Tr></Tr>
						)}
					</Thead>
					{!isLoading ? (
						data!?.length > 0 ? (
							<Tbody>
								{data?.map((expense: any, idx: number) => (
									<Tr
										key={idx}
										_hover={{
											bgColor: handleColorModeValue(
												"gray.100",
												"gray.900",
												colorMode
											),
											cursor: "pointer",
										}}
										bgColor={handleColorModeValue(
											"white",
											"gray.800",
											colorMode
										)}
										onClick={() => handleModalData(expense)}
									>
										<Td>
											<Skeleton
												isLoaded={!isFetching}
												startColor={handleColorModeValue(
													"gray.100",
													"gray.400",
													colorMode
												)}
												endColor={handleColorModeValue(
													"gray.400",
													"gray.700",
													colorMode
												)}
											>
												<Box
													fontWeight={"semibold"}
													sx={{
														fontVariantNumeric:
															"proportional-nums",
														verticalAlign:
															"baseline",
													}}
												>
													<Text fontSize={"sm"}>
														{
															parseDate(
																expense.date_time
															).date
														}
													</Text>
													<Text
														fontSize={"xs"}
														color={handleColorModeValue(
															"gray.500",
															"gray.400",
															colorMode
														)}
														mt={0.5}
													>
														{
															parseDate(
																expense.date_time
															).time
														}
													</Text>
												</Box>
											</Skeleton>
										</Td>
										<Td
											maxW={{ base: "xs", lg: "sm" }}
											w="sm"
										>
											<Skeleton
												isLoaded={!isFetching}
												startColor={handleColorModeValue(
													"gray.100",
													"gray.400",
													colorMode
												)}
												endColor={handleColorModeValue(
													"gray.400",
													"gray.700",
													colorMode
												)}
											>
												<Text
													overflow={"hidden"}
													textOverflow={"ellipsis"}
													fontWeight={"medium"}
													fontSize={"md"}
													textTransform={"capitalize"}
												>
													{expense.description}
												</Text>
											</Skeleton>
										</Td>
										<Td>
											<Skeleton
												isLoaded={!isFetching}
												startColor={handleColorModeValue(
													"gray.100",
													"gray.400",
													colorMode
												)}
												endColor={handleColorModeValue(
													"gray.400",
													"gray.700",
													colorMode
												)}
											>
												<Tag
													size={"md"}
													variant="subtle"
													colorScheme="telegram"
													rounded={"full"}
												>
													<TagLeftIcon boxSize="12px">
														{expense?.is_shared ? (
															<FiUsers
																size={"24px"}
															/>
														) : (
															<FiUser
																size={"24px"}
															/>
														)}
													</TagLeftIcon>
													<TagLabel>
														{expense?.is_shared
															? "Shared"
															: "Self"}
													</TagLabel>
												</Tag>
											</Skeleton>
										</Td>
										<Td isNumeric>
											<Skeleton
												isLoaded={!isFetching}
												startColor={handleColorModeValue(
													"gray.100",
													"gray.400",
													colorMode
												)}
												endColor={handleColorModeValue(
													"gray.400",
													"gray.700",
													colorMode
												)}
											>
												<Text
													fontSize={"md"}
													fontWeight={"semibold"}
												>
													₹{expense.amount}
												</Text>
											</Skeleton>
										</Td>
									</Tr>
								))}
							</Tbody>
						) : (
							<Tbody
								fontWeight={"medium"}
								color={handleColorModeValue(
									"red.500",
									"red.600",
									colorMode
								)}
								verticalAlign="center"
							>
								<Td textAlign={"center"}>No Expenses Found!</Td>
							</Tbody>
						)
					) : (
						<Tbody>
							{[1, 1, 1, 1, 1, 1, 1].map((item, idx) => (
								<Tr
									key={idx}
									_hover={{
										bgColor: handleColorModeValue(
											"gray.100",
											"gray.900",
											colorMode
										),
										cursor: "pointer",
									}}
									bgColor={handleColorModeValue(
										"white",
										"gray.800",
										colorMode
									)}
								>
									<Td>
										<Skeleton
											isLoaded={isFetching}
											startColor={handleColorModeValue(
												"gray.100",
												"gray.400",
												colorMode
											)}
											endColor={handleColorModeValue(
												"gray.400",
												"gray.700",
												colorMode
											)}
											h="6"
										></Skeleton>
									</Td>
									<Td>
										<Skeleton
											isLoaded={isFetching}
											startColor={handleColorModeValue(
												"gray.100",
												"gray.400",
												colorMode
											)}
											endColor={handleColorModeValue(
												"gray.400",
												"gray.700",
												colorMode
											)}
											h="6"
										></Skeleton>
									</Td>
									<Td>
										<Skeleton
											isLoaded={isFetching}
											startColor={handleColorModeValue(
												"gray.100",
												"gray.400",
												colorMode
											)}
											endColor={handleColorModeValue(
												"gray.400",
												"gray.700",
												colorMode
											)}
											h="6"
										></Skeleton>
									</Td>
									<Td>
										<Skeleton
											isLoaded={isFetching}
											startColor={handleColorModeValue(
												"gray.100",
												"gray.400",
												colorMode
											)}
											endColor={handleColorModeValue(
												"gray.400",
												"gray.700",
												colorMode
											)}
											h="6"
										></Skeleton>
									</Td>
								</Tr>
							))}
						</Tbody>
					)}
					<Tfoot
						pos={"sticky"}
						bottom={0}
						bgColor={handleColorModeValue(
							"white",
							"gray.900",
							colorMode
						)}
					>
						{data!?.length > 0 ? (
							<Tr>
								<Th>ITEMS</Th>
								<Th>{data?.length}</Th>
								<Th>TOTAL</Th>
								<Th isNumeric>₹{sumExpensesAmount}</Th>
							</Tr>
						) : (
							<></>
						)}
					</Tfoot>
				</Table>
			</TableContainer>
			<ExpenseEditModal
				onClose={onClose}
				isOpen={isOpen}
				data={modalData}
			/>
		</>
	);
};
