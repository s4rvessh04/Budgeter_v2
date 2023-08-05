import { Container, Grid, GridItem, useColorModeValue } from "@chakra-ui/react";
import { ExpenseTable, TopCards, Navbar } from "../components";
import { ExpenseList } from "../components/ExpenseList";

export const Home = () => {
	return (
		<Navbar>
			<Container
				minW={{
					base: "container.sm",
					lg: "container.md",
					xl: "container.xl",
				}}
				minH={{ xl: "100vh", base: "full" }}
				maxW={"full"}
				display={"flex"}
				flexDirection={"column"}
				px={{ base: 2, md: 4, lg: 4 }}
				py={{ base: 2, md: 4, lg: 4 }}
			>
				<TopCards />
				<Grid
					h={{ base: "5xl", lg: "xl" }}
					flex={1}
					templateColumns="repeat(6, 1fr)"
					gap={5}
				>
					<GridItem
						colSpan={{ base: 6, lg: 4 }}
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
						colSpan={{ base: 6, lg: 2 }}
						border={"1px"}
						rounded={"lg"}
						maxH={"full"}
						overflowY={"hidden"}
						borderColor={useColorModeValue("gray.300", "gray.700")}
						bgColor={useColorModeValue("white", "gray.900")}
					>
						<ExpenseList />
					</GridItem>
				</Grid>
			</Container>
		</Navbar>
	);
};
