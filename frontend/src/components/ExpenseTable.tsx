import React from "react";
import { useQuery } from "react-query";
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

	const { isLoading, data, isFetching } = useQuery(
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
							(prev: any, curr: any) => prev + parseFloat(curr.amount),
							0
						)
						.toFixed(2)
				),
				0
			),
		[data]
	);

	React.useEffect(() => {
		if (!isFetching) {
			const expensesSum = calcExpensesSum(data);
			updateSumExpensesAmount(expensesSum);
		}
		return;
	}, [isFetching]);

	function handleModalData(data: IExpense): void {
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
							"blackAlpha.50",
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
							<Tbody h="full">
								{data?.map((expense: any, idx: number) => (
									<Tr
										key={idx}
										_hover={{
											bgColor: handleColorModeValue(
												"blackAlpha.50",
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
													"blackAlpha.50",
													"gray.400",
													colorMode
												)}
												endColor={handleColorModeValue(
													"blackAlpha.200",
													"gray.700",
													colorMode
												)}
											>
												<Box
													fontWeight={"semibold"}
													sx={{
														fontVariantNumeric: "proportional-nums",
														verticalAlign: "baseline",
													}}
												>
													<Text fontSize={"sm"}>
														{parseDate(expense.create_dt).date}
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
														{parseDate(expense.create_dt).time}
													</Text>
												</Box>
											</Skeleton>
										</Td>
										<Td maxW={{ base: "xs", lg: "sm" }} w="sm">
											<Skeleton
												isLoaded={!isFetching}
												startColor={handleColorModeValue(
													"blackAlpha.50",
													"gray.400",
													colorMode
												)}
												endColor={handleColorModeValue(
													"blackAlpha.200",
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
													"blackAlpha.50",
													"gray.400",
													colorMode
												)}
												endColor={handleColorModeValue(
													"blackAlpha.200",
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
														{expense?.shared_expenses.length > 0 ? (
															<FiUsers size={"24px"} />
														) : (
															<FiUser size={"24px"} />
														)}
													</TagLeftIcon>
													<TagLabel>
														{expense?.shared_expenses.length > 0
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
													"blackAlpha.50",
													"gray.400",
													colorMode
												)}
												endColor={handleColorModeValue(
													"blackAlpha.200",
													"gray.700",
													colorMode
												)}
											>
												<Text fontSize={"md"} fontWeight={"semibold"}>
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
								color={handleColorModeValue("red.500", "red.600", colorMode)}
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
									bgColor={handleColorModeValue("white", "gray.800", colorMode)}
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
							"blackAlpha.50",
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
			<ExpenseEditModal onClose={onClose} isOpen={isOpen} data={modalData} />
		</>
	);
};
