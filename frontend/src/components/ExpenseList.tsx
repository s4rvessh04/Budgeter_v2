import {
	Tab,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	useColorModeValue,
} from "@chakra-ui/react";

export const ExpenseList = () => {
	return (
		<Tabs isLazy variant={"unstyled"}>
			<TabList
				justifyContent={"space-between"}
				gap={2}
				bg={useColorModeValue("gray.200", "gray.800")}
				p={1}
				rounded={"lg"}
			>
				<Tab
					w={"50%"}
					_selected={{
						bg: useColorModeValue("white", "gray.700"),
					}}
					_focus={{ outline: "none" }}
				>
					One
				</Tab>
				<Tab
					w={"50%"}
					_selected={{
						bg: useColorModeValue("white", "gray.700"),
					}}
					_focus={{ outline: "none" }}
				>
					Two
				</Tab>
			</TabList>
			<TabPanels>
				<TabPanel>
					<p>one!</p>
				</TabPanel>
				<TabPanel>
					<p>two!</p>
				</TabPanel>
			</TabPanels>
		</Tabs>
	);
};
