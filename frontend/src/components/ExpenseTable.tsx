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
	Box,
} from "@chakra-ui/react";

import { ExpenseEditModal } from "./ExpenseEditModal";

export const ExpenseTable = () => {
	const [loaded, setLoaded] = useState<boolean>(true);
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<TableContainer h={"full"} overflowY={"auto"}>
				<Table variant="simple" h={"full"}>
					<Thead
						pos={"sticky"}
						top={0}
						bgColor={useColorModeValue("white", "gray.900")}
					>
						<Tr>
							<Th>Date</Th>
							<Th>Description</Th>
							<Th isNumeric>Amount</Th>
						</Tr>
					</Thead>
					<Tbody>
						{[1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(() => (
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
										<Box
											fontWeight={"semibold"}
											sx={{
												fontVariantNumeric:
													"proportional-nums",
												verticalAlign: "baseline",
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
												mt={0.5}
											>
												12:05AM
											</Text>
										</Box>
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
							<Th>TOTAL</Th>
							<Th>20</Th>
							<Th isNumeric>₹20000</Th>
						</Tr>
					</Tfoot>
				</Table>
			</TableContainer>
			<ExpenseEditModal
				onClose={onClose}
				isOpen={isOpen}
				displayData={{
					date: "05th Aug, 2022",
					time: "10:31AM",
					description: "Food and Water",
					amount: "2000",
				}}
			/>
		</>
	);
};
