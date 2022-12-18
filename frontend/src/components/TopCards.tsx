import {
	Stat,
	StatGroup,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	useColorModeValue,
} from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import { useExpenseStore } from "../stores";

export const TopCards = () => {
	const expenseAmount = useExpenseStore((state) => state.sumExpensesAmount);

	return (
		<StatGroup columnGap={5} mb={5} display={{ base: "block", md: "flex" }}>
			{[
				{
					key: "a",
					type: "inc",
					title: "Expense",
					amount: `₹${expenseAmount}`,
					changePercentage: faker.datatype.float({
						min: 10,
						max: 100,
						precision: 0.01,
					}),
				},
				{
					key: "b",
					type: "inc",
					title: "Balance",
					amount: `₹${faker.finance.amount()}`,
					changePercentage: faker.datatype.float({
						min: 10,
						max: 100,
						precision: 0.01,
					}),
				},
				{
					key: "c",
					type: "dec",
					title: "Avg. Monthly Spending",
					amount: `₹${faker.finance.amount()}`,
					changePercentage: faker.datatype.float({
						min: 10,
						max: 100,
						precision: 0.01,
					}),
				},
			].map((item) => (
				<Stat
					key={item.key}
					border={"1px"}
					rounded={"lg"}
					borderColor={useColorModeValue("gray.300", "gray.700")}
					bgColor={useColorModeValue("white", "gray.800")}
					p={4}
					mb={{ base: 4, lg: "0" }}
				>
					<StatLabel>{item.title}</StatLabel>
					<StatNumber>{item.amount}</StatNumber>
					<StatHelpText>
						<StatArrow
							type={item.type == "inc" ? "increase" : "decrease"}
						/>
						{item.changePercentage}%
					</StatHelpText>
				</Stat>
			))}
		</StatGroup>
	);
};
