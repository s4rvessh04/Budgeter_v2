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
} from "@chakra-ui/react";
import { parseAmount, parseDate } from "../utils";
import { IExpenseList } from "../types/modals.component.types";
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { useOweExpenseStore } from "../stores";
import React from "react";
import shallow from "zustand/shallow";
import { useQuery } from "react-query";

interface Props {
	onClose: () => void;
	isOpen: boolean;
	data?: any;
}

export const OweModal = ({ onClose, isOpen, data }: Props) => {
	const TOAST = useToast();

	const [selectedExpenses, setSelectedExpenses] = React.useState<Number[]>(
		[]
	);
	const [oweData, setOweData] = React.useState([]);

	React.useEffect(() => {
		setOweData(data);
		return;
	}, [data]);

	function handleSelectExpense(idx: Number) {
		if (selectedExpenses.includes(idx)) {
			setSelectedExpenses(
				selectedExpenses.filter((item) => item !== idx)
			);
		} else {
			setSelectedExpenses([idx, ...selectedExpenses]);
		}
	}

	const totalAmount = React.useMemo(() => {
		return data?.expenses?.reduce(
			(prev, curr) =>
				parseFloat(prev) +
				parseFloat(curr.status === "UP" ? curr.amount : 0),
			0
		);
	}, [data]);

	React.useEffect(() => {
		if (!isOpen) {
			setSelectedExpenses([]);
		}
		return;
	}, [isOpen]);

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent bg={useColorModeValue("white", "gray.800")}>
				<ModalHeader>
					<Text fontWeight={"semibold"} fontSize="xl">
						{oweData?.owner?.full_name}
					</Text>
					<Text fontWeight={"semibold"} fontSize="lg">
						{parseAmount(totalAmount)}
					</Text>
				</ModalHeader>
				<ModalCloseButton _focus={{ outline: "none" }} />
				<ModalBody mb={2} px="2">
					{data?.expenses?.map((expense, idx) => (
						<Box
							key={idx}
							bg={useColorModeValue("gray.50", "gray.700")}
							border="1px"
							rounded={"lg"}
							borderColor={useColorModeValue(
								"gray.200",
								"gray.800"
							)}
							px="3"
							py="2"
							mb="2"
						>
							<Text
								fontWeight="medium"
								fontSize={"sm"}
								textTransform={"capitalize"}
								mb={1}
							>
								{parseDate(expense?.create_dt).date}
							</Text>
							<Text fontWeight={"medium"}>
								{expense?.expense?.description}
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
									colorScheme={
										expense?.status === "UP"
											? "red"
											: "green"
									}
								>
									<TagLeftIcon as={FiAlertCircle} />
									<TagLabel>
										{expense?.status === "UP"
											? "Unpaid"
											: "Paid"}
									</TagLabel>
								</Tag>
							</Flex>
						</Box>
					))}
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
