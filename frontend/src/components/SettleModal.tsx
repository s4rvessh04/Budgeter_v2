import {
	Button,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Text,
	useColorModeValue,
	useToast,
	Box,
	Tag,
	TagLabel,
	TagLeftIcon,
	Flex,
	useDisclosure,
} from "@chakra-ui/react";
import { axiosRequest, parseAmount, parseDate } from "../utils";
import { FiAlertCircle } from "react-icons/fi";
import { ExpenseEditModal } from "./ExpenseEditModal";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "react-query";

interface Props {
	onClose: () => void;
	isOpen: boolean;
	data?: any;
}

export const SettleModal = ({ onClose, isOpen, data }: Props) => {
	const expenseEditModalDisclosure = useDisclosure();
	const queryClient = useQueryClient();

	const [activeExpenseId, setActiveExpenseId] = useState(undefined);

	const { data: settleExpenseData, isLoading: settleExpensesLoading } =
		useQuery({
			queryKey: "activeSettleExpense",
			enabled: activeExpenseId !== undefined,
			queryFn: () =>
				axiosRequest
					.get(`/expenses/${activeExpenseId}`)
					.then((res) => res.data),
			onSuccess: () => {
				queryClient.invalidateQueries("sharedExpenses");
				queryClient.invalidateQueries("expenses");
			},
		});

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent bg={useColorModeValue("white", "gray.900")}>
					<ModalHeader>
						<Text fontWeight={"semibold"} fontSize="xl">
							{data?.user!?.full_name}
						</Text>
						<Text fontWeight={"semibold"} fontSize="lg">
							{parseAmount(data?.expensesSum)}
						</Text>
					</ModalHeader>
					<ModalCloseButton _focus={{ outline: "none" }} />
					<ModalBody px={3}>
						{data?.expenses?.map((expense, idx) => (
							<Box
								key={idx}
								bg={useColorModeValue("blackAlpha.50", "gray.700")}
								rounded={"md"}
								_hover={{
									bg: useColorModeValue("blackAlpha.100", "gray.800"),
								}}
								cursor="pointer"
								px={3}
								py={2}
								mb={3}
								onClick={() => {
									setActiveExpenseId(expense.expense.id);
									onClose();
									return expenseEditModalDisclosure.onOpen();
								}}
							>
								<Text
									fontWeight="normal"
									fontSize={"sm"}
									textColor={useColorModeValue("gray.600", "gray.400")}
									textTransform={"capitalize"}
									mb={1}
								>
									{parseDate(expense?.create_dt).date}
								</Text>
								<Text fontWeight={"medium"}>
									{expense?.expense.description}
								</Text>
								<Flex
									display={"flex"}
									justifyContent="space-between"
									alignItems={"center"}
									mt={2}
								>
									<Text fontSize={"lg"} fontWeight="semibold">
										₹{expense?.amount}
									</Text>
									<Tag
										rounded={"full"}
										variant="subtle"
										colorScheme={expense?.status === "UP" ? "red" : "green"}
									>
										<TagLeftIcon as={FiAlertCircle} />
										<TagLabel>
											{expense?.status === "UP" ? "Unpaid" : "Paid"}
										</TagLabel>
									</Tag>
								</Flex>
							</Box>
						))}
					</ModalBody>
				</ModalContent>
			</Modal>
			<ExpenseEditModal
				isOpen={expenseEditModalDisclosure.isOpen}
				onClose={expenseEditModalDisclosure.onClose}
				data={settleExpenseData}
			/>
		</>
	);
};
