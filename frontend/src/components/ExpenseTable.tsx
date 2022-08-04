import React, { useState } from "react";
import {
	Table,
	Thead,
	Tbody,
	Tfoot,
	Tr,
	Th,
	Td,
	TableContainer,
	Text,
	Skeleton,
	useColorModeValue,
	useDisclosure,
} from "@chakra-ui/react";

import { ExpenseEditDrawer } from "./ExpenseEditDrawer";
import { ExpenseEditModal } from "./ExpenseEditModal";

export const ExpenseTable = () => {
	const [loaded, setLoaded] = useState<boolean>(true);
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<TableContainer h={"full"} overflowY={"scroll"}>
				<Table variant="simple" h={"full"}>
					<Thead
						pos={"sticky"}
						top={0}
						bgColor={useColorModeValue("white", "gray.900")}
						zIndex={1}
					>
						<Tr>
							<Th>Date</Th>
							<Th>Description</Th>
							<Th isNumeric>Amount</Th>
						</Tr>
					</Thead>
					<Tbody>
						{Array.from({ length: 6 }).map((item) => (
							<Tr
								_hover={{
									bgColor: useColorModeValue(
										"gray.100",
										"gray.900"
									),
									cursor: "pointer",
								}}
								bgColor={useColorModeValue("white", "gray.800")}
								onClick={onOpen}
							>
								<Td>
									<Skeleton
										isLoaded={loaded}
										startColor={useColorModeValue(
											"gray.100",
											"gray.400"
										)}
										endColor={useColorModeValue(
											"gray.400",
											"gray.700"
										)}
									>
										<Text
											fontWeight={"semibold"}
											sx={{
												"font-variant-numeric":
													"proportional-nums",
												"vertical-align": "baseline",
											}}
										>
											<Text fontSize={"sm"}>
												2nd Aug, 2022
											</Text>
											<Text
												fontSize={"xs"}
												color={useColorModeValue(
													"gray.500",
													"gray.400"
												)}
												fontWeight={"semibold"}
												mt={0.5}
											>
												12:05AM
											</Text>
										</Text>
									</Skeleton>
								</Td>
								<Td>
									<Skeleton
										isLoaded={loaded}
										startColor={useColorModeValue(
											"gray.100",
											"gray.400"
										)}
										endColor={useColorModeValue(
											"gray.400",
											"gray.700"
										)}
									>
										<Text
											fontWeight={"medium"}
											fontSize={"md"}
										>
											Food and Stuff
										</Text>
									</Skeleton>
								</Td>
								<Td isNumeric>
									<Skeleton
										isLoaded={loaded}
										startColor={useColorModeValue(
											"gray.100",
											"gray.400"
										)}
										endColor={useColorModeValue(
											"gray.400",
											"gray.700"
										)}
									>
										<Text
											fontSize={"md"}
											fontWeight={"semibold"}
										>
											₹2000
										</Text>
									</Skeleton>
								</Td>
							</Tr>
						))}
					</Tbody>
					<Tfoot
						pos={"sticky"}
						bottom={0}
						bgColor={useColorModeValue("white", "gray.900")}
					>
						<Tr>
							<Th>To convert</Th>
							<Th>into</Th>
							<Th isNumeric>multiply by</Th>
						</Tr>
					</Tfoot>
				</Table>
			</TableContainer>
			{/* <ExpenseEditDrawer onClose={onClose} isOpen={isOpen} /> */}
			<ExpenseEditModal onClose={onClose} isOpen={isOpen} />
		</>
	);
};
