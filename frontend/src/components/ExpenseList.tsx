import React from "react";
import {
	Box,
	color,
	Flex,
	Grid,
	GridItem,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useColorMode,
	useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import shallow from "zustand/shallow";
import { faker } from "@faker-js/faker";
import { useQuery } from "react-query";

import { OweModal, SettleModal } from "../components";
import { IExpenseList } from "../types/modals.component.types";

import { handleColorModeValue, parseAmount } from "../utils";
import { useOweExpenseStore, useSettleExpenseStore } from "../stores";

export const ExpenseList = () => {
	const { colorMode } = useColorMode();

	const oweExpensesModalDisclosure = useDisclosure();
	const settleExpensesModalDisclosure = useDisclosure();

	const [modalData, setModalData] = React.useState<IExpenseList>();
	const [oweExpenses, setOweExpenses] = React.useState<IExpenseList[]>();
	const [sumOweExpenseAmount, updateSumOweExpenseAmount] = useOweExpenseStore(
		(state) => [
			state.sumOweExpensesAmount,
			state.updateSumOweExpensesAmount,
		],
		shallow
	);
	const [settleExpenses, setSettleExpenses] =
		React.useState<IExpenseList[]>();
	const [sumSettleExpensesAmount, updateSumSettleExpensesAmount] =
		useSettleExpenseStore(
			(state) => [
				state.sumSettleExpensesAmount,
				state.updateSumSettleExpensesAmount,
			],
			shallow
		);

	const { isLoading, error, data, isFetching } = useQuery(["owe-due"], () => {
		const data = axios
			.get("https://jsonplaceholder.typicode.com/todos/2")
			.then((res) => res.data);
		return data;
	});

	const expensesSum = React.useCallback(
		(expenses: IExpenseList[]) => {
			let sum = 0;

			expenses.forEach((item) => {
				let expensesSum: number = parseFloat(
					item.expenses
						.reduce((prev, curr) => prev + curr.amount, 0)
						.toFixed(2)
				);

				item.totalAmount = expensesSum;
				sum += expensesSum;
			});

			return parseFloat(sum.toFixed(2));
		},
		[oweExpenses, settleExpenses]
	);

	const createOweExpenses = React.useCallback(
		(count: number): IExpenseList[] => {
			let items: IExpenseList[] = [];

			for (let i = 0; i < count; i++) {
				let expenses = [];

				for (let j = 0; j < parseInt(faker.random.numeric(1)); j++) {
					let id = faker.database.mongodbObjectId();
					let dateTime = faker.date.past().toUTCString();
					let description = faker.finance.transactionDescription();
					let amount = parseFloat(faker.finance.amount());

					expenses.push({
						id: id,
						dateTime: dateTime,
						description: description,
						amount: amount,
					});
				}

				items.push({
					id: faker.database.mongodbObjectId(),
					name: faker.name.fullName(),
					totalAmount: parseFloat(faker.finance.amount()),
					expenses: expenses,
				});
			}
			return items;
		},
		[]
	);

	const createSettleExpenses = React.useCallback((count: number) => {
		let items: IExpenseList[] = [];

		for (let i = 0; i < count; i++) {
			let expenses = [];

			for (let j = 0; j < parseInt(faker.random.numeric(1)); j++) {
				expenses.push({
					id: faker.database.mongodbObjectId(),
					dateTime: faker.date.past().toUTCString(),
					description: faker.finance.transactionDescription(),
					amount: parseFloat(faker.finance.amount()),
				});
			}

			items.push({
				id: faker.database.mongodbObjectId(),
				name: faker.name.fullName(),
				totalAmount: parseFloat(faker.finance.amount()),
				expenses: expenses,
			});
		}
		return items;
	}, []);

	React.useEffect(() => {
		const settleExpenses = createSettleExpenses(10);
		const oweExpenses = createOweExpenses(10);
		setSettleExpenses(settleExpenses);
		setOweExpenses(oweExpenses);
		updateSumOweExpenseAmount(expensesSum(oweExpenses));
		updateSumSettleExpensesAmount(expensesSum(settleExpenses));
		return;
	}, []);

	function handleOweModal(data: any) {
		setModalData(data);
		return oweExpensesModalDisclosure.onOpen();
	}

	function handleSettleModal(data: any) {
		setModalData(data);
		return settleExpensesModalDisclosure.onOpen();
	}

	return (
		<Tabs isLazy variant={"unstyled"} h="full">
			<Flex flexDirection={"column"} h="inherit">
				<Box p="4" pb="0">
					<TabList
						justifyContent={"space-between"}
						gap={2}
						bg={handleColorModeValue(
							"gray.100",
							"gray.800",
							colorMode
						)}
						p={1}
						rounded={"lg"}
						h="min-content"
					>
						<Tab
							w={"50%"}
							_selected={{
								bg: handleColorModeValue(
									"white",
									"gray.700",
									colorMode
								),
							}}
							_focus={{ outline: "none" }}
						>
							Settle
						</Tab>
						<Tab
							w={"50%"}
							_selected={{
								bg: handleColorModeValue(
									"white",
									"gray.700",
									colorMode
								),
							}}
							_focus={{ outline: "none" }}
						>
							Owe
						</Tab>
					</TabList>
				</Box>
				<TabPanels flex={"1"} overflowY={"auto"}>
					<TabPanel p="0" pt="2" h="full">
						<Box h="full" overflow={"auto"}>
							{settleExpenses?.map((item, idx) => (
								<Grid
									key={idx}
									templateColumns="repeat(4, 1fr)"
									gap={4}
									px={4}
									py={4}
									borderBottom={"1px"}
									borderColor={handleColorModeValue(
										"gray.100",
										"gray.700",
										colorMode
									)}
									w="full"
									onClick={() => handleSettleModal(item)}
									_hover={{
										bgColor: handleColorModeValue(
											"gray.100",
											"gray.800",
											colorMode
										),
										cursor: "pointer",
									}}
								>
									<GridItem
										colSpan={3}
										display="flex"
										alignItems={"center"}
										justifyContent={"start"}
										noOfLines={2}
										fontWeight="medium"
									>
										{item.name}
									</GridItem>
									<GridItem
										fontWeight={"semibold"}
										colSpan={1}
										display="flex"
										justifyContent="end"
									>
										{parseAmount(item.totalAmount)}
									</GridItem>
								</Grid>
							))}
							<Grid
								templateColumns="repeat(4, 1fr)"
								gap={4}
								px={4}
								py={3}
								w="full"
								pos="sticky"
								bottom="0"
								bgColor={handleColorModeValue(
									"white",
									"gray.900",
									colorMode
								)}
								fontSize={"xs"}
								textTransform={"uppercase"}
								fontWeight="bold"
								color={handleColorModeValue(
									"gray.700",
									"gray.400",
									colorMode
								)}
							>
								<GridItem
									colSpan={3}
									display="flex"
									alignItems={"center"}
									justifyContent={"start"}
								>
									Total
								</GridItem>
								<GridItem
									colSpan={1}
									display="flex"
									alignItems={"center"}
									justifyContent={"end"}
								>
									₹{sumSettleExpensesAmount}
								</GridItem>
							</Grid>
						</Box>
					</TabPanel>
					<TabPanel p="0" pt="2" h="full">
						<Box h="full" overflow={"auto"}>
							{oweExpenses?.map((expense, idx) => (
								<Grid
									key={idx}
									templateColumns="repeat(4, 1fr)"
									gap={4}
									px={4}
									py={4}
									borderBottom={"1px"}
									borderColor={handleColorModeValue(
										"gray.100",
										"gray.700",
										colorMode
									)}
									w="full"
									onClick={() => handleOweModal(expense)}
									_hover={{
										bgColor: handleColorModeValue(
											"gray.100",
											"gray.800",
											colorMode
										),
										cursor: "pointer",
									}}
								>
									<GridItem
										colSpan={3}
										display="flex"
										alignItems={"center"}
										justifyContent={"start"}
										noOfLines={2}
										fontWeight="medium"
									>
										{expense.name}
									</GridItem>
									<GridItem
										fontWeight={"semibold"}
										colSpan={1}
										display="flex"
										justifyContent="end"
									>
										{parseAmount(expense.totalAmount)}
									</GridItem>
								</Grid>
							))}
							<Grid
								templateColumns="repeat(4, 1fr)"
								gap={4}
								px={4}
								py={3}
								w="full"
								pos="sticky"
								bottom="0"
								bgColor={handleColorModeValue(
									"white",
									"gray.900",
									colorMode
								)}
								fontSize={"xs"}
								textTransform={"uppercase"}
								fontWeight="bold"
								color={handleColorModeValue(
									"gray.700",
									"gray.400",
									colorMode
								)}
							>
								<GridItem
									colSpan={3}
									display="flex"
									alignItems={"center"}
									justifyContent={"start"}
								>
									Total
								</GridItem>
								<GridItem
									colSpan={1}
									display="flex"
									alignItems={"center"}
									justifyContent={"end"}
								>
									₹{sumOweExpenseAmount}
								</GridItem>
							</Grid>
						</Box>
					</TabPanel>
				</TabPanels>
			</Flex>
			<OweModal
				onClose={oweExpensesModalDisclosure.onClose}
				isOpen={oweExpensesModalDisclosure.isOpen}
				data={modalData}
			/>
			<SettleModal
				onClose={settleExpensesModalDisclosure.onClose}
				isOpen={settleExpensesModalDisclosure.isOpen}
				data={modalData}
			/>
		</Tabs>
	);
};
