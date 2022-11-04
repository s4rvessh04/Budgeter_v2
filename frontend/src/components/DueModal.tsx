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

export const DueModal = ({ onClose, isOpen, displayData }: Props) => {
	const format = (val: string) => `₹` + val;
	const parse = (val: string) => val.replace(/^\$/, "");

	const dateTime = parseDate(displayData!?.dateTime);

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent overflow={"hidden"}>
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
				<ModalBody mb={4}>
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
				</ModalBody>
				{/* <ModalFooter>
					<Button onClick={onClose}>Cancel</Button>
				</ModalFooter> */}
			</ModalContent>
		</Modal>
	);
};
