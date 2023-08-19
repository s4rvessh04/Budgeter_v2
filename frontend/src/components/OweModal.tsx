import {
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
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
import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";

interface Props {
	onClose: () => void;
	isOpen: boolean;
	data?: any;
}

export const OweModal = ({ onClose, isOpen, data }: Props) => {
	const TOAST = useToast();

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent bg={useColorModeValue("white", "gray.900")}>
				<ModalHeader>
					<Text fontWeight={"semibold"} fontSize="xl">
						{data?.user?.full_name}
					</Text>
					<Text fontWeight={"semibold"} fontSize="lg">
						{parseAmount(data?.expensesSum)}
					</Text>
				</ModalHeader>
				<ModalCloseButton _focus={{ outline: "none" }} />
				<ModalBody mb={2} px="2">
					{data?.expenses?.map((expense, idx) => (
						<Box
							key={idx}
							bg={useColorModeValue("blackAlpha.50", "gray.700")}
							rounded={"md"}
							px={3}
							py={2}
							mb={3}
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
							<Text fontWeight={"medium"}>{expense?.expense?.description}</Text>
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
	);
};
