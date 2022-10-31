import {
	Stat,
	StatGroup,
	StatLabel,
	StatNumber,
	StatHelpText,
	StatArrow,
	useColorModeValue,
} from "@chakra-ui/react";

type CardData<T> = {
	title: T;
	amount: T;
	perChange: T;
};

export const TopCards = (data?: CardData<string>[]) => {
	return (
		<StatGroup columnGap={5} mb={5} display={{ base: "block", md: "flex" }}>
			{[
				{
					key: "a",
					type: "inc",
					title: "Expense",
					amount: "1000",
					changePercentage: "44.22",
				},
				{
					key: "b",
					type: "inc",
					title: "Balance",
					amount: "1000",
					changePercentage: "24.00",
				},
				{
					key: "c",
					type: "dec",
					title: "Savings",
					amount: "1200",
					changePercentage: "50.00",
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
