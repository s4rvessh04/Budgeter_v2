import {
	Box,
	Container,
	Flex,
	Grid,
	GridItem,
	useColorModeValue,
} from "@chakra-ui/react";
import { ExpenseTable, TopCards } from "../components";
import { ExpenseList } from "../components/ExpenseList";

export const Home = () => {
	return (
		<Container maxW="container.xl">
			<TopCards />
			<Grid h={"xl"} templateColumns="repeat(6, 1fr)" gap={5}>
				<GridItem
					colSpan={4}
					border={"1px"}
					rounded={"lg"}
					maxH={"full"}
					overflowY={"hidden"}
					borderColor={useColorModeValue("gray.300", "gray.700")}
					bgColor={useColorModeValue("white", "gray.900")}
				>
					<ExpenseTable />
				</GridItem>
				<GridItem
					colSpan={2}
					border={"1px"}
					rounded={"lg"}
					borderColor={useColorModeValue("gray.300", "gray.700")}
					p={4}
					bgColor={useColorModeValue("white", "gray.900")}
				>
					<ExpenseList />
				</GridItem>
			</Grid>
		</Container>
	);
};
