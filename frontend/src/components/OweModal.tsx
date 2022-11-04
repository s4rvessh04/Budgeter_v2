import {
	Button,
	FormControl,
	FormLabel,
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
	Select,
} from "@chakra-ui/react";
import { parseDate } from "../utils";

type displayData = {
	name: string;
	dateTime: string;
	description: string;
	amount: string;
	status: string;
};

interface Props {
	onClose: () => void;
	isOpen: boolean;
	displayData?: displayData;
}

export const OweModal = ({ onClose, isOpen, displayData }: Props) => {
	const toast = useToast();
	const dateTime = parseDate(displayData!?.dateTime);

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>
					{displayData?.name}
					<Text
						fontWeight={"semibold"}
						fontSize="sm"
						color={useColorModeValue("gray.500", "gray.400")}
					>
						{dateTime.date} - {dateTime.time}
					</Text>
				</ModalHeader>
				<ModalCloseButton _focus={{ outline: "none" }} />
				<ModalBody mb={2}>
					<Text
						fontWeight="semibold"
						textTransform={"capitalize"}
						mb={1}
					>
						{displayData?.description}
					</Text>
					<Text fontSize={"2xl"} fontWeight="bold">
						₹{displayData?.amount}
					</Text>
					<FormControl mt="4">
						<FormLabel
							fontWeight={"semibold"}
							fontSize="sm"
							color={useColorModeValue("gray.500", "gray.400")}
						>
							Status
						</FormLabel>
						<Select variant="filled" fontWeight={"semibold"}>
							<option
								value="unpaid"
								selected={
									displayData?.status.toLowerCase() ===
									"unpaid"
								}
							>
								Unpaid
							</option>
							<option
								value="paid"
								selected={
									displayData?.status.toLowerCase() === "paid"
								}
							>
								Paid
							</option>
						</Select>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button
						colorScheme="telegram"
						mr={3}
						onClick={() =>
							toast({
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
