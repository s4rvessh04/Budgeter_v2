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
	VStack,
	HStack,
	Flex,
	useColorModeValue,
	Box,
	useToast,
} from "@chakra-ui/react";
import * as Fi from "react-icons/fi";

type displayData = {
	date: string;
	time: string;
	description: string;
	amount: string;
};

interface Props {
	onClose: () => void;
	isOpen: boolean;
	displayData: displayData;
}

export const ExpenseEditModal = ({ onClose, isOpen, displayData }: Props) => {
	const format = (val: string) => `₹` + val;
	const parse = (val: string) => val.replace(/^\$/, "");

	const toast = useToast();

	const [value, setValue] = React.useState(displayData.amount);

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Edit Expense</ModalHeader>
					<ModalCloseButton _focus={{ outline: "none" }} />
					<ModalBody pb={6}>
						<Flex justify={"space-between"} alignItems={"center"}>
							<Text
								fontWeight={"semibold"}
								sx={{
									fontVariantNumeric: "proportional-nums",
									verticalAlign: "baseline",
								}}
							>
								<Text fontSize={"md"}>{displayData.date}</Text>
								<Text
									fontSize={"sm"}
									color={useColorModeValue(
										"gray.500",
										"gray.400"
									)}
									mt={0.5}
								>
									{displayData.time}
								</Text>
							</Text>
							<Box>
								<Tag
									size={"md"}
									variant="subtle"
									colorScheme="telegram"
								>
									<TagLeftIcon boxSize="12px">
										<Fi.FiUser size={"24px"} />
									</TagLeftIcon>
									<TagLabel>Self</TagLabel>
								</Tag>
							</Box>
						</Flex>

						<FormControl mt={4}>
							<FormLabel>Description</FormLabel>
							<Input placeholder={displayData.description} />
						</FormControl>
						<FormControl mt={4}>
							<FormLabel>Amount</FormLabel>
							<NumberInput
								onChange={(valueString) =>
									setValue(parse(valueString))
								}
								value={format(value)}
								step={100}
							>
								<NumberInputField />
								<NumberInputStepper>
									<NumberIncrementStepper />
									<NumberDecrementStepper />
								</NumberInputStepper>
							</NumberInput>
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
