import React from "react";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Icon,
	Input,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Select,
	Switch,
	Text,
	useColorModeValue,
	useToast,
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { useMutation, useQueryClient } from "react-query";
import { axiosRequest } from "../utils";
import { Cookies } from "react-cookie";
import { faker } from "@faker-js/faker";

interface Props {
	onClose: () => void;
	isOpen: boolean;
}

interface SharedExpense {
	name: string;
	amount: number;
	status: "P" | "UP";
}

interface FormData {
	description: string;
	amount: number;
	is_shared: boolean;
	shared_expenses: SharedExpense[];
}

export const NewExpenseModal = ({ onClose, isOpen }: Props) => {
	const cookies = new Cookies();

	const toast = useToast();
	const queryClient = useQueryClient();

	const [isShared, setIsShared] = React.useState(false);
	const [sharedExpenseData, setSharedExpenseData] = React.useState<
		SharedExpense[]
	>([]);

	const friends = [
		{ name: faker.name.fullName(), id: faker.datatype.uuid() },
		{ name: faker.name.fullName(), id: faker.datatype.uuid() },
		{ name: faker.name.fullName(), id: faker.datatype.uuid() },
		{ name: faker.name.fullName(), id: faker.datatype.uuid() },
		{ name: faker.name.fullName(), id: faker.datatype.uuid() },
		{ name: faker.name.fullName(), id: faker.datatype.uuid() },
	];

	const mutation = useMutation({
		mutationFn: (formData: FormData) =>
			axiosRequest.post("/expenses/", formData),
		onSuccess: () => {
			queryClient.invalidateQueries("expenses");
			toast({
				title: "Expense Added!",
				description: "Expense added successfully.",
				status: "success",
				duration: 2500,
				isClosable: true,
			});
		},
		onError: (err: any) => {
			toast({
				title: "Error!",
				description: err.response.data,
				status: "error",
				duration: 2500,
				isClosable: true,
			});
		},
	});

	const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formDataElement = new FormData(e.target as HTMLFormElement);
		let formDataFinal: any = {};
		let shared_expense: any = [];

		const shared_users = [...formDataElement.getAll("shared_user")];
		const shared_amounts = [...formDataElement.getAll("shared_amount")];

		shared_users.forEach((user, index) => {
			shared_expense.push({
				name: user,
				amount: shared_amounts[index],
				status: "UP",
			});
		});

		formDataElement.forEach((value, key) => {
			if (key !== "shared_user" && key !== "shared_amount")
				formDataFinal[key] = value;
		});

		formDataFinal.shared_expenses = shared_expense;
		formDataFinal.date_time = new Date().toISOString();

		console.log(formDataFinal);
		mutation.mutate(formDataFinal);
	};

	const handleSetIsShared = () => {
		setIsShared(!isShared);
	};

	const handleSharedExpense = () => {
		setSharedExpenseData([
			...sharedExpenseData,
			{ name: "", amount: 0, status: "UP" },
		]);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Expense</ModalHeader>
				<ModalCloseButton _focus={{ outline: "none" }} />
				<ModalBody mb={2}>
					<form
						onSubmit={handleFormSubmit}
						encType="multipart/form-data"
					>
						<input
							type="hidden"
							name="csrfmiddlewaretoken"
							value={cookies.get("csrftoken")}
						/>
						<Flex direction={"column"} gap="5" rounded={"md"}>
							<FormControl isRequired>
								<FormLabel>Description</FormLabel>
								<Input
									placeholder="Enter desciption"
									name="description"
								/>
							</FormControl>

							<FormControl isRequired>
								<FormLabel>Amount</FormLabel>
								<NumberInput
									step={200}
									defaultValue={0}
									min={0}
								>
									<NumberInputField name="amount" />
									<NumberInputStepper>
										<NumberIncrementStepper />
										<NumberDecrementStepper />
									</NumberInputStepper>
								</NumberInput>
							</FormControl>

							<FormControl display="flex" alignItems="center">
								<FormLabel htmlFor="shared-expense" mb="0">
									Shared Expense?
								</FormLabel>
								<Switch
									id="shared-expense"
									name="is_shared"
									onChange={handleSetIsShared}
									value={isShared ? "true" : "false"}
								/>
							</FormControl>
							{isShared ? (
								<FormControl isRequired>
									<FormLabel>With</FormLabel>
									{sharedExpenseData.map((item, index) => (
										<Flex gap="4" mb="4" key={index}>
											<Select name="shared_user">
												{friends.map(
													(friend, index) => (
														<option
															value={friend.name}
															key={index}
														>
															{friend.name}
														</option>
													)
												)}
											</Select>
											<NumberInput
												step={100}
												defaultValue={0}
												min={0}
											>
												<NumberInputField
													name={"shared_amount"}
												/>
												<NumberInputStepper>
													<NumberIncrementStepper />
													<NumberDecrementStepper />
												</NumberInputStepper>
											</NumberInput>
										</Flex>
									))}
									<Flex>
										<Button
											w={"full"}
											variant="ghost"
											colorScheme={"blue"}
											mt="4"
											onClick={handleSharedExpense}
										>
											Add new
										</Button>
									</Flex>
								</FormControl>
							) : (
								""
							)}

							<Flex
								justifyContent={"space-between"}
								alignItems="center"
							>
								<Box>
									<Text fontSize="md" fontWeight={"medium"}>
										Final Amount
									</Text>
									<Text fontSize="lg" fontWeight={"bold"}>
										{4000}
									</Text>
								</Box>
								<Button colorScheme={"telegram"} type="submit">
									Save Expense
								</Button>
							</Flex>
						</Flex>
					</form>
				</ModalBody>
			</ModalContent>
		</Modal>
	);
};
