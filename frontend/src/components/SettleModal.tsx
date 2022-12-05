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
import React from "react";

interface Props {
	onClose: () => void;
	isOpen: boolean;
	data?: IExpenseList;
}

export const SettleModal = ({ onClose, isOpen, data }: Props) => {
	const TOAST = useToast();
	const TOTAL_AMOUNT = parseAmount(data!?.totalAmount);

	const [selectedExpenses, setSelectedExpenses] = React.useState<Number[]>(
		[]
	);

	function handleSelectExpense(idx: Number) {
		if (selectedExpenses.includes(idx)) {
			setSelectedExpenses(
				selectedExpenses.filter((item) => item !== idx)
			);
		} else {
			setSelectedExpenses([idx, ...selectedExpenses]);
		}
	}

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
						{data?.name}
					</Text>
					<Text fontWeight={"semibold"} fontSize="lg">
						{TOTAL_AMOUNT}
					</Text>
				</ModalHeader>
				<ModalCloseButton _focus={{ outline: "none" }} />
				<ModalBody mb={2} px="2">
					{data?.expenses.map((expense, idx) => (
						<Box
							key={idx}
							onClick={() => handleSelectExpense(idx)}
							bg={useColorModeValue("gray.50", "gray.700")}
							border="1px"
							rounded={"lg"}
							borderColor={useColorModeValue(
								"gray.200",
								"gray.800"
							)}
							cursor="pointer"
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
								{parseDate(expense?.dateTime).date}
							</Text>
							<Text fontWeight={"medium"}>
								{expense?.description}
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
								{selectedExpenses.includes(idx) ? (
									<Tag
										rounded={"full"}
										variant="subtle"
										colorScheme={"green"}
									>
										<TagLeftIcon as={FiCheckCircle} />
										<TagLabel>Paid</TagLabel>
									</Tag>
								) : (
									<Tag
										rounded={"full"}
										variant="subtle"
										colorScheme={"red"}
									>
										<TagLeftIcon as={FiAlertCircle} />
										<TagLabel>Unpaid</TagLabel>
									</Tag>
								)}
							</Flex>
						</Box>
					))}
				</ModalBody>
				<ModalFooter>
					<Button
						colorScheme="telegram"
						mr={3}
						onClick={() =>
							TOAST({
								title: `Saved successfully`,
								position: "bottom",
								isClosable: true,
								status: "success",
							}) && onClose()
						}
					>
						Save
					</Button>
					<Button onClick={onClose}>Cancel</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};