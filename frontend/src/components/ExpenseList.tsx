import React, { useEffect, useMemo, useState } from "react";
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

	const [activeTab, setActiveTab] = useState<"settle" | "owe">("settle");
	const [activePanelData, setActivePanelData] = useState<any>([]);

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

	const { data: settleExpensesData, isLoading: settleExpensesLoading } =
		useQuery({
			queryKey: "sharedExpenses",
			enabled: activeTab === "settle",
			queryFn: () =>
				axiosRequest.get("/expenses/shared/").then((res) => res.data),
		});

	const { data: oweExpensesData, isLoading: oweExpensesLoading } = useQuery({
		queryKey: "oweExpenses",
		enabled: activeTab === "owe",
		queryFn: () =>
			axiosRequest.get("/expenses/shared/owe/").then((res) => res.data),
	});

	const handleActiveTab = (tabName: "settle" | "owe") => {
		setActiveTab(tabName);
	};

	useEffect(() => {
		function handleCurrentData(data: unknown[]) {
			let processedData: unknown[] = [];

			data.forEach((item) => {
				let userData = {
					user: {},
					expenses: [],
					expensesSum: 0,
				};

				const userSumAmount = item.expenses.reduce(
					(prev, curr) =>
						parseFloat(prev) +
						parseFloat(curr.status === "UP" ? curr.amount : 0),
					0
				);

				if (item.owner !== undefined) userData.user = item.owner;
				if (item.loaner !== undefined) userData.user = item.loaner;

				userData.expensesSum = userSumAmount;
				userData.expenses = item.expenses;

				processedData.push(userData);
			});

			return processedData;
		}

		if (activeTab === "owe" && !oweExpensesLoading) {
			const data = handleCurrentData(oweExpensesData);
			const sum = data.reduce(
				(prev, curr) => parseFloat(prev) + parseFloat(curr.expensesSum),
				0
			);
			updateSumOweExpenseAmount(sum as number);
			setActivePanelData(data);
		}
		if (activeTab === "settle" && !settleExpensesLoading) {
			const data = handleCurrentData(settleExpensesData);
			const sum = data.reduce(
				(prev, curr) => parseFloat(prev) + parseFloat(curr.expensesSum),
				0
			);
			updateSumSettleExpenseAmount(sum as number);
			setActivePanelData(data);
		}

		return;
	}, [
		oweExpensesData,
		settleExpensesData,
		activeTab,
		oweExpensesLoading,
		settleExpensesLoading,
	]);

	return (
		<Tabs isLazy variant={"unstyled"} h="full">
			<Flex flexDirection={"column"} h="inherit">
				<Box p="4" pb="0">
					<TabList
						justifyContent={"space-between"}
						gap={2}
						p={1}
						rounded={"lg"}
						h="min-content"
						bg={handleColorModeValue("blackAlpha.100", "gray.800", colorMode)}
					>
						<Tab
							w={"50%"}
							_selected={{
								bg: handleColorModeValue("white", "gray.700", colorMode),
								textColor: handleColorModeValue("gray.700", "white", colorMode),
								boxShadow: "md",
							}}
							_focus={{ outline: "none" }}
							onClick={() => handleActiveTab("settle")}
							rounded={"md"}
							fontWeight={"semibold"}
							textColor={handleColorModeValue(
								"blackAlpha.500",
								"gray.400",
								colorMode
							)}
						>
							Settle
						</Tab>
						<Tab
							w={"50%"}
							_selected={{
								bg: handleColorModeValue("white", "gray.700", colorMode),
								textColor: handleColorModeValue("gray.700", "white", colorMode),
								boxShadow: "md",
							}}
							_focus={{ outline: "none" }}
							onClick={() => handleActiveTab("owe")}
							rounded={"md"}
							fontWeight={"semibold"}
							textColor={handleColorModeValue(
								"blackAlpha.500",
								"gray.400",
								colorMode
							)}
						>
							Owe
						</Tab>
					</TabList>
				</Box>
				<TabPanels flex={"1"} overflowY={"auto"}>
					<TabPanel p="0" pt="2" h="full">
						<Box h="full" overflow={"auto"}>
							{activePanelData?.map((item, idx) => (
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
											"blackAlpha.50",
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
										{item?.user.full_name}
									</GridItem>
									<GridItem
										fontWeight={"semibold"}
										colSpan={1}
										display="flex"
										justifyContent="end"
									>
										{parseAmount(item.expensesSum)}
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
								bgColor={handleColorModeValue("white", "gray.900", colorMode)}
								fontSize={"xs"}
								textTransform={"uppercase"}
								fontWeight="bold"
								color={handleColorModeValue("gray.700", "gray.400", colorMode)}
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
									{parseAmount(sumSettleExpensesAmount)}
								</GridItem>
							</Grid>
						</Box>
					</TabPanel>
					<TabPanel p="0" pt="2" h="full">
						<Box h="full" overflow={"auto"}>
							{activePanelData?.map((data, idx) => (
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
											"blackAlpha.50",
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
										{data?.user.full_name}
									</GridItem>
									<GridItem
										fontWeight={"semibold"}
										colSpan={1}
										display="flex"
										justifyContent="end"
									>
										{parseAmount(data.expensesSum)}
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
								bgColor={handleColorModeValue("white", "gray.900", colorMode)}
								fontSize={"xs"}
								textTransform={"uppercase"}
								fontWeight="bold"
								color={handleColorModeValue("gray.700", "gray.400", colorMode)}
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
									{parseAmount(sumOweExpenseAmount)}
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
