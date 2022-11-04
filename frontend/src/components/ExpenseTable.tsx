import { useEffect, useMemo, useState } from "react";
import { faker } from "@faker-js/faker";
import axios from "axios";
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
	useColorModeValue,
	useDisclosure,
	Box,
	Tag,
	TagLeftIcon,
	TagLabel,
} from "@chakra-ui/react";
import { FiUser, FiUsers } from "react-icons/fi";
import { useQuery } from "react-query";
import { useAtom } from "jotai";

import { ExpenseEditModal } from "./ExpenseEditModal";
import { expenseAmountAtom } from "../atoms/Home";

export const ExpenseTable = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [loaded, setLoaded] = useState<boolean>(false);
	const [expenses, setExpenses] = useState<any[]>();
	const [modalData, setModalData] = useState<any>();
	const [expenseAmount, setExpenseAmount] = useAtom(expenseAmountAtom);

	const { isLoading, error, data, isFetching } = useQuery(["data"], () => {
		const data = axios
			.get("https://jsonplaceholder.typicode.com/todos/1")
			.then((res) => res.data);
		return data;
	});

	useMemo(
		() =>
			setExpenseAmount(
				expenses
					?.reduce((prev, curr) => {
						return prev + parseFloat(curr.amount);
					}, 0)
					.toFixed(2)
			),
		[expenses]
	);

	useEffect(() => {
		setExpenses(createData(8));
		setLoaded(true);
		return;
	}, []);

	function createData(count: number) {
		let items: any[] = [];

		for (let i = 0; i < count; i++) {
			items.push({
				dateTime: faker.date.past().toUTCString(),
				description: faker.finance.transactionDescription(),
				amount: faker.finance.amount(),
				isShared: faker.datatype.boolean(),
			});
		}
		return items;
	}

	function parseDate(dateString: string): { date: String; time: String } {
		const utcString: Date = new Date(dateString);
		return {
			date: utcString.toDateString(),
			time: utcString.toTimeString().slice(0, 5),
		};
	}

	function handleModalData(data: any) {
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
						bgColor={useColorModeValue("white", "gray.900")}
					>
						<Tr>
							<Th>Date</Th>
							<Th>Description</Th>
							<Th>Type</Th>
							<Th isNumeric>Amount</Th>
						</Tr>
					</Thead>
					{!isLoading ? (
						expenses != undefined && expenses.length > 0 ? (
							<Tbody>
								{expenses?.map((expense, idx) => (
									<Tr
										key={idx}
										_hover={{
											bgColor: useColorModeValue(
												"gray.100",
												"gray.900"
											),
											cursor: "pointer",
										}}
										bgColor={useColorModeValue(
											"white",
											"gray.800"
										)}
										onClick={() => handleModalData(expense)}
									>
										<Td>
											<Skeleton
												isLoaded={loaded}
												startColor={useColorModeValue(
													"gray.100",
													"gray.400"
												)}
												endColor={useColorModeValue(
													"gray.400",
													"gray.700"
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
																expense.dateTime
															).date
														}
													</Text>
													<Text
														fontSize={"xs"}
														color={useColorModeValue(
															"gray.500",
															"gray.400"
														)}
														mt={0.5}
													>
														{
															parseDate(
																expense.dateTime
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
												isLoaded={loaded}
												startColor={useColorModeValue(
													"gray.100",
													"gray.400"
												)}
												endColor={useColorModeValue(
													"gray.400",
													"gray.700"
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
												isLoaded={loaded}
												startColor={useColorModeValue(
													"gray.100",
													"gray.400"
												)}
												endColor={useColorModeValue(
													"gray.400",
													"gray.700"
												)}
											>
												<Tag
													size={"md"}
													variant="subtle"
													colorScheme="telegram"
													rounded={"full"}
												>
													<TagLeftIcon boxSize="12px">
														{expense?.isShared ? (
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
														{expense?.isShared
															? "Shared"
															: "Self"}
													</TagLabel>
												</Tag>
											</Skeleton>
										</Td>
										<Td isNumeric>
											<Skeleton
												isLoaded={loaded}
												startColor={useColorModeValue(
													"gray.100",
													"gray.400"
												)}
												endColor={useColorModeValue(
													"gray.400",
													"gray.700"
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
							<Tbody>Nothing found</Tbody>
						)
					) : (
						<Tbody>
							{[1, 1, 1, 1, 1, 1, 1].map((item, idx) => (
								<Tr
									key={idx}
									_hover={{
										bgColor: useColorModeValue(
											"gray.100",
											"gray.900"
										),
										cursor: "pointer",
									}}
									bgColor={useColorModeValue(
										"white",
										"gray.800"
									)}
								>
									<Td>
										<Skeleton
											isLoaded={loaded}
											startColor={useColorModeValue(
												"gray.100",
												"gray.400"
											)}
											endColor={useColorModeValue(
												"gray.400",
												"gray.700"
											)}
											h="6"
										></Skeleton>
									</Td>
									<Td>
										<Skeleton
											isLoaded={loaded}
											startColor={useColorModeValue(
												"gray.100",
												"gray.400"
											)}
											endColor={useColorModeValue(
												"gray.400",
												"gray.700"
											)}
											h="6"
										></Skeleton>
									</Td>
									<Td>
										<Skeleton
											isLoaded={loaded}
											startColor={useColorModeValue(
												"gray.100",
												"gray.400"
											)}
											endColor={useColorModeValue(
												"gray.400",
												"gray.700"
											)}
											h="6"
										></Skeleton>
									</Td>
									<Td>
										<Skeleton
											isLoaded={loaded}
											startColor={useColorModeValue(
												"gray.100",
												"gray.400"
											)}
											endColor={useColorModeValue(
												"gray.400",
												"gray.700"
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
						bgColor={useColorModeValue("white", "gray.900")}
					>
						<Tr>
							<Th>ITEMS</Th>
							<Th>{expenses?.length}</Th>
							<Th>TOTAL</Th>
							<Th isNumeric>₹{expenseAmount}</Th>
						</Tr>
					</Tfoot>
				</Table>
			</TableContainer>
			<ExpenseEditModal
				onClose={onClose}
				isOpen={isOpen}
				displayData={modalData}
			/>
		</>
	);
};
