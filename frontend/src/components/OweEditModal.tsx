import React from "react";
import {
	Button,
	FormControl,
	FormLabel,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberDecrementStepper,
	NumberIncrementStepper,
	Text,
	Tag,
	TagLeftIcon,
	TagLabel,
	Flex,
	useColorModeValue,
	Box,
	useToast,
	Icon,
	Select,
	Heading,
} from "@chakra-ui/react";
import * as Fi from "react-icons/fi";
import { HiExclamationCircle } from "react-icons/hi";

type displayData = {
	name: string;
	date: string;
	time: string;
	description: string;
	amount: string;
	status: string;
};

interface Props {
	onClose: () => void;
	isOpen: boolean;
	displayData: displayData;
}

export const OweEditModal = ({ onClose, isOpen, displayData }: Props) => {
	const format = (val: string) => `₹` + val;
	const parse = (val: string) => val.replace(/^\$/, "");

	const toast = useToast();

	const [value, setValue] = React.useState(displayData.amount);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize={"sm"}
						color={useColorModeValue("gray.600", "gray.400")}
					>
						{displayData.date} - {displayData.time}
					</ModalHeader>
					<ModalCloseButton _focus={{ outline: "none" }} />
					<ModalBody pb={6}>
						<Text fontSize={"xl"} fontWeight="semibold">
							{displayData.description}
						</Text>
						<Text fontSize={"2xl"} fontWeight="bold">
							₹{displayData.amount}
						</Text>
						<FormControl mt="4">
							<FormLabel>Status</FormLabel>
							<Select variant="filled">
								<option value="option1" defaultChecked>
									Unpaid
								</option>
								<option value="option2">Paid</option>
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
		</>
	);
};
