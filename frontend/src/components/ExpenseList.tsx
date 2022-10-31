import {
	Box,
	Flex,
	Icon,
	Tab,
	Table,
	TableContainer,
	TabList,
	TabPanel,
	TabPanels,
	Tabs,
	Tag,
	TagLabel,
	Tbody,
	Td,
	Tfoot,
	Th,
	Tr,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi";
import { OweEditModal } from "./OweEditModal";

export const ExpenseList = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();

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
				<TabPanels flexGrow={"1"} overflowY="auto">
					<TabPanel p="0" pt="2" h="full">
						<TableContainer h="full" overflowY={"auto"}>
							<Table size="md" variant="simple" h="full">
								<Tbody>
									{[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(
										(item) => (
											<Tr
												onClick={onOpen}
												_hover={{
													bgColor: useColorModeValue(
														"gray.100",
														"gray.800"
													),
													cursor: "pointer",
												}}
											>
												<Td>Foo Bar</Td>
												<Td
													isNumeric
													fontWeight={"semibold"}
												>
													₹1000
												</Td>
												<Td isNumeric>
													<Tag
														size="md"
														colorScheme="red"
														borderRadius="full"
													>
														<Icon
															as={
																HiExclamationCircle
															}
															ml={-1}
															h={"4"}
															w={"4"}
															mr={1}
														/>
														<TagLabel>
															Unpaid
														</TagLabel>
													</Tag>
												</Td>
											</Tr>
										)
									)}
								</Tbody>
								<Tfoot
									pos="sticky"
									bottom="0"
									bgColor={useColorModeValue(
										"white",
										"gray.900"
									)}
								>
									<Tr>
										<Th>Total</Th>
										<Th isNumeric>₹2000</Th>
										<Th isNumeric>20</Th>
									</Tr>
								</Tfoot>
							</Table>
						</TableContainer>
					</TabPanel>
					<TabPanel p="0" pt="2" h="full">
						<TableContainer h="full" overflowY={"auto"}>
							<Table size="md" variant="simple" h="full">
								<Tbody>
									{[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(
										(item) => (
											<Tr
												_hover={{
													bgColor: useColorModeValue(
														"gray.100",
														"gray.800"
													),
													cursor: "pointer",
												}}
											>
												<Td>John Doe</Td>
												<Td
													isNumeric
													fontWeight={"semibold"}
												>
													₹1000
												</Td>
												<Td isNumeric>
													<Tag
														size="md"
														colorScheme="green"
														borderRadius="full"
													>
														<Icon
															as={HiCheckCircle}
															ml={-1}
															h={"4"}
															w={"4"}
															mr={1}
														/>
														<TagLabel>
															Paid
														</TagLabel>
													</Tag>
												</Td>
											</Tr>
										)
									)}
								</Tbody>
								<Tfoot
									pos="sticky"
									bottom="0"
									bgColor={useColorModeValue(
										"white",
										"gray.900"
									)}
								>
									<Tr>
										<Th>Total</Th>
										<Th isNumeric>₹2000</Th>
										<Th isNumeric>20</Th>
									</Tr>
								</Tfoot>
							</Table>
						</TableContainer>
					</TabPanel>
				</TabPanels>
			</Flex>
			<OweEditModal
				onClose={onClose}
				isOpen={isOpen}
				displayData={{
					date: "05th Aug, 2022",
					time: "10:31AM",
					description: "Food and Water",
					amount: "2000",
					status: "Unpaid",
					name: "John Doe",
				}}
			/>
		</Tabs>
	);
};
