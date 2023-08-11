import React from "react";
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
	useColorMode,
	useDisclosure,
} from "@chakra-ui/react";
import shallow from "zustand/shallow";
import { faker } from "@faker-js/faker";
import { useQuery } from "react-query";

import { OweModal, SettleModal } from "../components";

import { handleColorModeValue, parseAmount } from "../utils";
import { axiosRequest } from "../utils/axiosInstance";
import { useOweExpenseStore, useSettleExpenseStore } from "../stores";

export const ExpenseList = () => {
	const { colorMode } = useColorMode();

	const oweExpensesModalDisclosure = useDisclosure();
	const settleExpensesModalDisclosure = useDisclosure();

	const [selectedOweExpense, setSelectedOweExpense] = React.useState();
	const [selectedSettleExpense, setSelectedSettleExpense] = React.useState();

	const [
		sumOweExpenseAmount,
		updateSumOweExpenseAmount,
		addSumOweExpensesAmount,
		resetSumOweExpensesAmount,
	] = useOweExpenseStore(
		(state) => [
			state.sumOweExpensesAmount,
			state.updateSumOweExpensesAmount,
			state.addSumOweExpensesAmount,
			state.resetSumOweExpensesAmount,
		],
		shallow
	);

	const [
		sumSettleExpensesAmount,
		updateSumSettleExpenseAmount,
		addSumSettleExpensesAmount,
		resetSumSettleExpensesAmount,
	] = useSettleExpenseStore(
		(state) => [
			state.sumSettleExpensesAmount,
			state.updateSumSettleExpensesAmount,
			state.addSumSettleExpensesAmount,
			state.resetSumSettleExpensesAmount,
		],
		shallow
	);

	const { data: oweExpensesData, isLoading: oweExpensesLoading } = useQuery({
		queryKey: "oweExpenses",
		queryFn: () =>
			axiosRequest.get("/expenses/shared/owe/").then((res) => res.data),
		onSuccess: (data) => {
			resetSumOweExpensesAmount();
			console.log("owe", data);
		},
	});

	const { data: settleExpensesData, isLoading: settleExpensesLoading } =
		useQuery({
			queryKey: "sharedExpenses",
			queryFn: () =>
				axiosRequest.get("/expenses/shared/").then((res) => res.data),
			onSuccess: (data) => {
				resetSumSettleExpensesAmount();
				console.log("shared", data);
			},
		});

	// const createOweExpenses = React.useCallback(updateSumSettleExpensesAmount(totalAmount);
	// 	(count: number): IExpenseList[] => {
	// 		let items: IExpenseList[] = [];

	// 		for (let i = 0; i < count; i++) {
	// 			let expenses = [];

	// 			for (let j = 0; j < parseInt(faker.random.numeric(1)); j++) {
	// 				let id = faker.database.mongodbObjectId();
	// 				let dateTime = faker.date.past().toUTCString();
	// 				let description = faker.finance.transactionDescription();
	// 				let amount = parseFloat(faker.finance.amount());

	// 				expenses.push({
	// 					id: id,
	// 					dateTime: dateTime,
	// 					description: description,
	// 					amount: amount,
	// 				});
	// 			}

	// 			items.push({
	// 				id: faker.database.mongodbObjectId(),
	// 				name: faker.name.fullName(),
	// 				totalAmount: parseFloat(faker.finance.amount()),
	// 				expenses: expenses,
	// 			});
	// 		}
	// 		return items;
	// 	},
	// 	[]
	// );

	// const createSettleExpenses = React.useCallback((count: number) => {
	// 	let items: IExpenseList[] = [];

	// 	for (let i = 0; i < count; i++) {
	// 		let expenses = [];

	// 		for (let j = 0; j < parseInt(faker.random.numeric(1)); j++) {
	// 			expenses.push({
	// 				id: faker.database.mongodbObjectId(),
	// 				dateTime: faker.date.past().toUTCString(),
	// 				description: faker.finance.transactionDescription(),
	// 				amount: parseFloat(faker.finance.amount()),
	// 			});
	// 		}

	// 		items.push({
	// 			id: faker.database.mongodbObjectId(),
	// 			name: faker.name.fullName(),
	// 			totalAmount: parseFloat(faker.finance.amount()),
	// 			expenses: expenses,
	// 		});
	// 	}
	// 	return items;
	// }, []);

	// React.useEffect(() => {
	// 	const settleExpenses = createSettleExpenses(10);
	// 	const oweExpenses = createOweExpenses(10);
	// 	setSettleExpenses(settleExpenses);
	// 	setOweExpenses(oweExpenses);
	// 	updateSumOweExpenseAmount(expensesSum(oweExpenses));
	// 	updateSumSettleExpensesAmount(expensesSum(settleExpenses));
	// 	return;
	// }, []);

	// function handleOweModal(data: any) {
	// 	setModalData(data);
	// 	return oweExpensesModalDisclosure.onOpen();
	// }

	// function handleSettleModal(data: any) {
	// 	setModalData(data);
	// 	return settleExpensesModalDisclosure.onOpen();
	// }

	const handleSumSettleExpenses = () => {
		let individualSum = {};
		let sum = 0;

		settleExpensesData?.forEach((item) => {
			const personTotal = item.expenses.reduce(
				(prev, curr) =>
					parseFloat(prev) +
					parseFloat(curr.status === "UP" ? curr.amount : 0),
				0
			);
			individualSum[item?.loaner?.full_name] = personTotal;
			sum += personTotal;
		});

		const handleIndividualSum = (fullName) => {
			return individualSum[fullName];
		};

		return { handleIndividualSum, sum };
	};

	const handleSumOweExpenses = () => {
		let individualSum = {};
		let sum = 0;

		oweExpensesData?.forEach((item) => {
			const personTotal = item.expenses.reduce(
				(prev, curr) =>
					parseFloat(prev) +
					parseFloat(curr.status === "UP" ? curr.amount : 0),
				0
			);
			individualSum[item?.owner?.full_name] = personTotal;
			sum += personTotal;
		});

		console.log(individualSum);

		const handleIndividualSum = (fullName) => {
			return individualSum[fullName];
		};

		return { handleIndividualSum, sum };
	};

	// const sumPersonSettleExpenses = (data) => {
	// 	const totalAmount = data.reduce(
	// 		(prev, curr) =>
	// 			parseFloat(prev) +
	// 			parseFloat(curr.status === "UP" ? curr.amount : 0),
	// 		0
	// 	);
	// 	// addSumSettleExpensesAmount(totalAmount);
	// 	setSumSettleExpenses(sumSettleExpenses + totalAmount);
	// 	return totalAmount;
	// };

	// const sumPersonOweExpenses = (data) => {
	// 	const totalAmount = data.reduce(
	// 		(prev, curr) =>
	// 			parseFloat(prev) +
	// 			parseFloat(curr.status === "UP" ? curr.amount : 0),
	// 		0
	// 	);
	// 	// addSumOweExpensesAmount(totalAmount);
	// 	setSumOweExpenses(sumOweExpenses + totalAmount);
	// 	return totalAmount;
	// };

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
							{settleExpensesData?.map((item, idx) => (
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
									onClick={() => {
										setSelectedSettleExpense(item);
										return settleExpensesModalDisclosure.onOpen();
									}}
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
										{item.loaner.full_name}
									</GridItem>
									<GridItem
										fontWeight={"semibold"}
										colSpan={1}
										display="flex"
										justifyContent="end"
									>
										{parseAmount(
											handleSumSettleExpenses().handleIndividualSum(
												item.loaner.full_name
											)
										)}
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
									₹{handleSumSettleExpenses().sum}
								</GridItem>
							</Grid>
						</Box>
					</TabPanel>
					<TabPanel p="0" pt="2" h="full">
						<Box h="full" overflow={"auto"}>
							{oweExpensesData?.map((data, idx) => (
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
									onClick={() => {
										setSelectedOweExpense(data);
										return oweExpensesModalDisclosure.onOpen();
									}}
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
										{data?.owner.full_name}
									</GridItem>
									<GridItem
										fontWeight={"semibold"}
										colSpan={1}
										display="flex"
										justifyContent="end"
									>
										{parseAmount(
											handleSumOweExpenses().handleIndividualSum(
												data.owner.full_name
											)
										)}
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
									₹{handleSumOweExpenses().sum}
								</GridItem>
							</Grid>
						</Box>
					</TabPanel>
				</TabPanels>
			</Flex>
			<OweModal
				onClose={oweExpensesModalDisclosure.onClose}
				isOpen={oweExpensesModalDisclosure.isOpen}
				data={selectedOweExpense}
			/>
			<SettleModal
				onClose={settleExpensesModalDisclosure.onClose}
				isOpen={settleExpensesModalDisclosure.isOpen}
				data={selectedSettleExpense}
			/>
		</Tabs>
	);
};
