import { useEffect, useMemo, useState } from "react";
import {
	Box,
	Flex,
	Grid,
	GridItem,
	Icon,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Tag,
	TagLabel,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { OweModal, DueModal } from "../components";
import { faker } from "@faker-js/faker";
import { useQuery } from "react-query";
import { useAtom } from "jotai";
import axios from "axios";
import { dueAmountAtom, oweAmountAtom } from "../atoms";

type displayData = {
	name: string;
	dateTime: string;
	description: string;
	amount: string;
	status: string;
};

export const ExpenseList = () => {
	const oweModalDisclosure = useDisclosure();
	const dueModalDisclosure = useDisclosure();

	const [oweExpenses, setOweExpenses] = useState<any[]>();
	const [dueExpenses, setDueExpenses] = useState<any[]>();
	const [oweAmountSum, setOweAmountSum] = useAtom(oweAmountAtom);
	const [dueAmountSum, setDueAmountSum] = useAtom(dueAmountAtom);
	const [modalData, setModalData] = useState<displayData>();

	const { isLoading, error, data, isFetching } = useQuery(["owe-due"], () => {
		const data = axios
			.get("https://jsonplaceholder.typicode.com/todos/2")
			.then((res) => res.data);
		return data;
	});

	useMemo(
		() =>
			setOweAmountSum(
				oweExpenses
					?.reduce((prev, curr) => {
						return prev + parseFloat(curr.amount);
					}, 0)
					.toFixed(2)
			),
		[oweExpenses]
	);

	useMemo(
		() =>
			setDueAmountSum(
				dueExpenses
					?.reduce((prev, curr) => {
						return prev + parseFloat(curr.amount);
					}, 0)
					.toFixed(2)
			),
		[dueExpenses]
	);

	useEffect(() => {
		setDueExpenses(createOweData(10));
		setOweExpenses(createDueData(10));
		return;
	}, []);

	const createOweData = (count: number) => {
		let items: any[] = [];

		for (let i = 0; i < count; i++) {
			items.push({
				name: faker.name.fullName(),
				dateTime: faker.date.past().toUTCString(),
				description: faker.finance.transactionDescription(),
				amount: faker.finance.amount(),
				status: faker.datatype.boolean() === true ? "Paid" : "Unpaid",
			});
		}
		return items;
	};

	const createDueData = (count: number) => {
		let items: any[] = [];

		for (let i = 0; i < count; i++) {
			items.push({
				name: faker.name.fullName(),
				dateTime: faker.date.past().toUTCString(),
				description: faker.finance.transactionDescription(),
				amount: faker.finance.amount(),
				status: faker.datatype.boolean() === true ? "Paid" : "Unpaid",
			});
		}
		return items;
	};

	function handleOweModal(data: any) {
		setModalData(data);
		return oweModalDisclosure.onOpen();
	}

	function handleDueModal(data: any) {
		setModalData(data);
		return dueModalDisclosure.onOpen();
	}

	return (
		<Tabs isLazy variant={"unstyled"} h="full">
			<Flex flexDirection={"column"} h="inherit">
				<Box p="4" pb="0">
					<TabList
						justifyContent={"space-between"}
						gap={2}
						bg={useColorModeValue("gray.200", "gray.800")}
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
							Owe
						</Tab>
						<Tab
							w={"50%"}
							_selected={{
								bg: useColorModeValue("white", "gray.700"),
							}}
							_focus={{ outline: "none" }}
						>
							Due
						</Tab>
					</TabList>
				</Box>
				<TabPanels flex={"1"} overflowY={"auto"}>
					<TabPanel p="0" pt="2" h="full">
						<Box h="full" overflow={"auto"}>
							{oweExpenses?.map((item, idx) => (
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
									onClick={() => handleOweModal(item)}
									_hover={{
										bgColor: useColorModeValue(
											"gray.100",
											"gray.800"
										),
										cursor: "pointer",
									}}
								>
									<GridItem
										colSpan={2}
										display="flex"
										alignItems={"center"}
										justifyContent={"start"}
										noOfLines={2}
									>
										{item.name}
									</GridItem>
									<GridItem
										colSpan={1}
										fontWeight={"semibold"}
										display="flex"
										alignItems={"center"}
										justifyContent={"end"}
									>
										₹{item.amount}
									</GridItem>
									<GridItem
										colSpan={1}
										display="flex"
										alignItems={"center"}
										justifyContent={"start"}
									>
										<Tag
											size="md"
											colorScheme={
												item.status.toLowerCase() ===
												"paid"
													? "green"
													: "red"
											}
											borderRadius="full"
										>
											<Icon
												as={
													item.status.toLowerCase() ===
													"paid"
														? HiCheckCircle
														: HiExclamationCircle
												}
												ml={-1}
												h={"4"}
												w={"4"}
												mr={1}
											/>
											<TagLabel>{item.status}</TagLabel>
										</Tag>
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
									colSpan={2}
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
									₹{oweAmountSum}
								</GridItem>
								<GridItem
									colSpan={1}
									display="flex"
									alignItems={"center"}
									justifyContent={"start"}
								>
									20
								</GridItem>
							</Grid>
						</Box>
					</TabPanel>
					<TabPanel p="0" pt="2" h="full">
						<Box h="full" overflow={"auto"}>
							{dueExpenses?.map((item, idx) => (
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
									onClick={() => handleDueModal(item)}
									_hover={{
										bgColor: useColorModeValue(
											"gray.100",
											"gray.800"
										),
										cursor: "pointer",
									}}
								>
									<GridItem
										colSpan={2}
										display="flex"
										alignItems={"center"}
										justifyContent={"start"}
										noOfLines={2}
									>
										{item.name}
									</GridItem>
									<GridItem
										colSpan={1}
										fontWeight={"semibold"}
										display="flex"
										alignItems={"center"}
										justifyContent={"end"}
									>
										₹{item.amount}
									</GridItem>
									<GridItem
										colSpan={1}
										display="flex"
										alignItems={"center"}
										justifyContent={"start"}
									>
										<Tag
											size="md"
											colorScheme={
												item.status.toLowerCase() ===
												"paid"
													? "green"
													: "red"
											}
											borderRadius="full"
										>
											<Icon
												as={
													item.status.toLowerCase() ===
													"paid"
														? HiCheckCircle
														: HiExclamationCircle
												}
												ml={-1}
												h={"4"}
												w={"4"}
												mr={1}
											/>
											<TagLabel>{item.status}</TagLabel>
										</Tag>
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
									colSpan={2}
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
									₹{oweAmountSum}
								</GridItem>
								<GridItem
									colSpan={1}
									display="flex"
									alignItems={"center"}
									justifyContent={"start"}
								>
									20
								</GridItem>
							</Grid>
						</Box>
					</TabPanel>
				</TabPanels>
			</Flex>
			<OweModal
				onClose={oweModalDisclosure.onClose}
				isOpen={oweModalDisclosure.isOpen}
				displayData={modalData}
			/>
			<DueModal
				onClose={dueModalDisclosure.onClose}
				isOpen={dueModalDisclosure.isOpen}
				displayData={modalData}
			/>
		</Tabs>
	);
};
