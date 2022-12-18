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
	useToast,
	IconButton,
	Flex,
	Box,
	useColorModeValue,
	Select,
	Divider,
} from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import React from "react";
import { FiX } from "react-icons/fi";

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

export const QuickSettingsModal = ({ onClose, isOpen, displayData }: Props) => {
	const toast = useToast();

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Quick Settings</ModalHeader>
				<ModalCloseButton _focus={{ outline: "none" }} />
				<ModalBody mb={2}>
					<Text fontSize={"lg"} fontWeight="bold" color={"gray.700"}>
						Expense Data
					</Text>
					<Flex
						justifyContent="space-between"
						// alignItems="center"
						gap={1}
						mt="2"
						direction="column"
					>
						<Text
							fontSize={"md"}
							fontWeight="semibold"
							mb="1"
							flexShrink={0}
						>
							Filter by:
						</Text>
						<Select variant="filled">
							<option value="option1">Current Month</option>
							<option value="option2">All Time</option>
							<option value="option3">Select Date</option>
						</Select>
					</Flex>
				</ModalBody>
				<ModalFooter p="3">
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
						Apply
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
