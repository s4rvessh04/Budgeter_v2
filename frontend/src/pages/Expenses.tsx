import React from "react";
import {
	Box,
	Container,
	Flex,
	FormControl,
	Grid,
	GridItem,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Tag,
	TagLabel,
	TagLeftIcon,
	Text,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { Navbar } from "../components";
import { FiFilter, FiSearch, FiUser, FiUsers } from "react-icons/fi";
import { faker } from "@faker-js/faker";
import { parseDate, parseAmount } from "../utils";
import { useQuery } from "react-query";

import { ExpenseEditModal } from "../components";
import { IExpense, ISharedExpense } from "../types";
import axios from "axios";

export const Expenses = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

	const [loaded, setLoaded] = React.useState<boolean>(false);
	const [expenses, setExpenses] = React.useState<IExpense[]>();
	const [modalData, setModalData] = React.useState<IExpense>();

	const { isLoading, error, data, isFetching } = useQuery(["data"], () => {
		const data = axios
			.get("https://jsonplaceholder.typicode.com/todos/1")
			.then((res) => res.data);
		return data;
	});

	React.useEffect(() => {
		setExpenses(createData(10));
		setLoaded(true);
		return;
	}, []);

	function createData(count: number): IExpense[] {
		let items: IExpense[] = [];

		for (let i = 0; i < count; i++) {
			let expense: IExpense = {
				id: faker.database.mongodbObjectId(),
				userId: faker.datatype.number().toString(),
				description: faker.finance.transactionDescription(),
				dateTime: faker.date.past().toUTCString(),
				lastUpdateTime: faker.date.recent().toUTCString(),
				amount: parseFloat(faker.finance.amount()),
				isShared: faker.datatype.boolean(),
				sharedExpenses: [],
			};

			let sharedExpenses: ISharedExpense[] = [];

			for (let j = 0; j < parseInt(faker.random.numeric()); j++) {
				sharedExpenses.push({
					id: faker.database.mongodbObjectId(),
					expenseId: expense.id,
					lastUpdateTime: faker.date.recent().toUTCString(),
					mainUserId: expense.userId,
					sharedUserId: faker.name.fullName(),
					sharedUserAmount: parseFloat(faker.finance.amount()),
					status:
						faker.datatype.boolean() === true ? "paid" : "unpaid",
				});
			}
			expense.sharedExpenses = sharedExpenses;
			items.push(expense);
		}
		return items;
	}

	function handleModalData(data: IExpense): void {
		setModalData(data);
		return onOpen();
	}

	return (
		<Navbar>
			<Container
				maxW={{ base: "container.lg", xl: "container.xl" }}
				px={{ base: 2, md: 4, lg: 4 }}
			>
				<FormControl
					w={{ base: "full", lg: "50%" }}
					justifyItems="center"
					m="auto"
					mb={{ base: "4", lg: "6" }}
					display="flex"
					gap={2}
				>
					<InputGroup>
						<InputLeftElement
							pointerEvents={"none"}
							children={<FiSearch />}
						/>
						<Input
							placeholder="Search expenses"
							bg={useColorModeValue("white", "gray.800")}
							border="1px"
							borderColor={useColorModeValue(
								"gray.200",
								"gray.700"
							)}
						/>
					</InputGroup>
					<IconButton
						aria-label="filter-btn"
						icon={<FiFilter />}
						variant="outline"
						bg={useColorModeValue("white", "gray.800")}
					/>
				</FormControl>
				<Grid
					templateColumns={{
						base: "repeat(1, 1fr)",
						lg: "repeat(3, 1fr)",
					}}
					gap={{ base: 4, lg: 6 }}
				>
					{expenses?.map((expense, key) => (
						<GridItem
							p="4"
							rounded="lg"
							bg={useColorModeValue("white", "gray.800")}
							border="1px"
							borderColor={useColorModeValue(
								"gray.200",
								"gray.700"
							)}
							onClick={() => handleModalData(expense)}
							cursor="pointer"
						>
							<Flex
								key={key}
								justifyContent="space-between"
								alignItems={"center"}
							>
								<Box
									fontWeight={"semibold"}
									sx={{
										fontVariantNumeric: "proportional-nums",
										verticalAlign: "baseline",
									}}
								>
									<Text fontSize={"sm"}>
										{parseDate(expense.dateTime).date}
									</Text>
									<Text
										fontSize={"xs"}
										color={useColorModeValue(
											"gray.500",
											"gray.400"
										)}
										mt={0.5}
									>
										{parseDate(expense.dateTime).time}
									</Text>
								</Box>
								<Tag
									size={"md"}
									variant="subtle"
									colorScheme="telegram"
									rounded={"full"}
								>
									<TagLeftIcon boxSize="12px">
										{expense?.isShared ? (
											<FiUsers size={"24px"} />
										) : (
											<FiUser size={"24px"} />
										)}
									</TagLeftIcon>
									<TagLabel>
										{expense?.isShared ? "Shared" : "Self"}
									</TagLabel>
								</Tag>
							</Flex>
							<Text fontWeight={"medium"} mt="2">
								{expense?.description}
							</Text>
							<Text fontWeight={"bold"} fontSize="lg" mt="2">
								{parseAmount(expense?.amount)}
							</Text>
						</GridItem>
					))}
				</Grid>
			</Container>
			<ExpenseEditModal
				onClose={onClose}
				isOpen={isOpen}
				data={modalData}
			/>
		</Navbar>
	);
};
