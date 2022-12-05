import { useEffect, useMemo, useState } from "react";
import {
	Box,
	Flex,
	Grid,
	GridItem,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { OweModal, SettleModal } from "../components";
import { faker } from "@faker-js/faker";
import { useQuery } from "react-query";
import { useAtom } from "jotai";
import axios from "axios";
import { settleExpensesAmountAtom, oweExpensesAmountAtom } from "../atoms";
import { parseAmount } from "../utils";
import { IExpenseList } from "../types/modals.component.types";

export const ExpenseList = () => {
	const oweExpensesModalDisclosure = useDisclosure();
	const settleExpensesModalDisclosure = useDisclosure();

	const [oweExpenses, setOweExpenses] = useState<IExpenseList[]>();
	const [settleExpenses, setSettleExpenses] = useState<IExpenseList[]>();
	const [oweExpensesSum, setOweExpensesSum] = useAtom(oweExpensesAmountAtom);
	const [settleExpensesSum, setSettleExpensesSum] = useAtom(
		settleExpensesAmountAtom
	);
	const [modalData, setModalData] = useState<IExpenseList>();

	const { isLoading, error, data, isFetching } = useQuery(["owe-due"], () => {
		const data = axios
			.get("https://jsonplaceholder.typicode.com/todos/2")
			.then((res) => res.data);
		return data;
	});

	useMemo(() => {
		let oweSum = 0;

		oweExpenses?.forEach((item) => {
			let expensesSum: number = parseFloat(
				item.expenses
					.reduce((prev, curr) => prev + curr.amount, 0)
					.toFixed(2)
			);

			item.totalAmount = expensesSum;
			oweSum += expensesSum;
		});

		setOweExpensesSum(parseFloat(oweSum.toFixed(2)));
	}, [oweExpenses]);

	useMemo(() => {
		let settleSum = 0;

		settleExpenses?.forEach((item) => {
			let expensesSum: number = parseFloat(
				item.expenses
					.reduce((prev, curr) => prev + curr.amount, 0)
					.toFixed(2)
			);

			item.totalAmount = expensesSum;
			settleSum += expensesSum;
		});

		setSettleExpensesSum(parseFloat(settleSum.toFixed(2)));
	}, [settleExpenses]);

	useEffect(() => {
		setSettleExpenses(createSettleExpenses(10));
		setOweExpenses(createOweExpenses(10));
		return;
	}, []);

	const createOweExpenses = (count: number): IExpenseList[] => {
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
	};

	const createSettleExpenses = (count: number) => {
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
	};

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
						bg={useColorModeValue("gray.100", "gray.800")}
						p={1}
						rounded={"lg"}
						h="min-content"
					>
						<Tab
							w={"50%"}
							_selected={{
								bg: useColorModeValue("white", "gray.700"),
							}}
							_focus={{ outline: "none" }}
						>
							Settle
						</Tab>
						<Tab
							w={"50%"}
							_selected={{
								bg: useColorModeValue("white", "gray.700"),
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
									borderColor={useColorModeValue(
										"gray.100",
										"gray.700"
									)}
									w="full"
									onClick={() => handleSettleModal(item)}
									_hover={{
										bgColor: useColorModeValue(
											"gray.100",
											"gray.800"
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
								bgColor={useColorModeValue("white", "gray.900")}
								fontSize={"xs"}
								textTransform={"uppercase"}
								fontWeight="bold"
								color={useColorModeValue(
									"gray.700",
									"gray.400"
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
									₹{settleExpensesSum}
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
									borderColor={useColorModeValue(
										"gray.100",
										"gray.700"
									)}
									w="full"
									onClick={() => handleOweModal(expense)}
									_hover={{
										bgColor: useColorModeValue(
											"gray.100",
											"gray.800"
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
								bgColor={useColorModeValue("white", "gray.900")}
								fontSize={"xs"}
								textTransform={"uppercase"}
								fontWeight="bold"
								color={useColorModeValue(
									"gray.700",
									"gray.400"
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
									₹{oweExpensesSum}
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
