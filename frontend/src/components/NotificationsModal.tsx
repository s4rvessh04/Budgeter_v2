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
} from "@chakra-ui/react";
import { faker } from "@faker-js/faker";
import React from "react";
import { FiX } from "react-icons/fi";
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

export const NotificationsModal = ({ onClose, isOpen, displayData }: Props) => {
	const toast = useToast();

	const [notifications, setNotifications] = React.useState<any[]>();

	function createNotifications(count: number) {
		let items: any[] = [];

		for (let i = 0; i < count; i++) {
			items.push({
				message: faker.git.commitMessage(),
				type: "expense",
				dateTime: faker.datatype.datetime().toDateString(),
				name: faker.name.fullName(),
			});
		}
		return items;
	}

	React.useEffect(() => {
		setNotifications(createNotifications(5));
		return;
	}, []);

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Notifications</ModalHeader>
				<ModalCloseButton _focus={{ outline: "none" }} />
				<ModalBody mb={2} px={4}>
					{notifications?.map((val, idx) => (
						<Flex
							justifyContent={"space-between"}
							alignItems={"center"}
							key={idx}
							mb="1.5"
							rounded={"md"}
							px={2}
							py={2}
						>
							<Box>
								<Text fontSize="medium" fontWeight="medium">
									{val.message}
								</Text>
								<Text
									fontSize={"sm"}
									fontWeight="medium"
									color={"gray.500"}
								>
									{val.name}
								</Text>
							</Box>
							<IconButton
								aria-label="close-btn"
								icon={<FiX />}
								size="sm"
							/>
						</Flex>
					))}
				</ModalBody>
				<ModalFooter p="3">
					<Button
						colorScheme="red"
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
						Dismiss All
					</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};
