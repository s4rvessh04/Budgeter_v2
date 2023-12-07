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
	ModalHeader,
	ModalOverlay,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	NumberDecrementStepper,
	NumberIncrementStepper,
	Text,
	Flex,
	useColorModeValue,
	Box,
	useToast,
	Select,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Icon,
} from "@chakra-ui/react";
import { FiChevronDown } from "react-icons/fi";
import { axiosRequest, parseAmount } from "../utils";
import { useMutation, useQueryClient, useQuery } from "react-query";
import {
	Control,
	Controller,
	SubmitHandler,
	useFieldArray,
	useForm,
	useWatch,
} from "react-hook-form";
import { Cookies } from "react-cookie";
import { HiPlus } from "react-icons/hi";

interface Props {
	onClose: () => void;
	isOpen: boolean;
	data: any;
}

interface ISharedExpense {
	id?: number;
	loaner_id?: number;
	status?: "UP" | "P";
	create_dt?: string;
	update_dt?: string;
	amount?: string;
	expense?: number;
}

interface IFormData {
	id?: number;
	description?: string;
	create_dt?: string;
	update_dt?: string;
	amount?: string;
	shared_expenses?: ISharedExpense[];
}

const TotalAmount = ({
	control,
	amount,
}: {
	control: Control<IFormData>;
	amount: string;
}) => {
	const formData = useWatch({
		name: "shared_expenses",
		control,
	});

	const sharedAmount: number = React.useMemo(() => {
		const sum: number = formData!?.reduce(
			(prev, curr) => prev + (parseFloat(curr.amount!) || 0),
			0
		);
		return sum;
	}, [formData]);

	const yourSplit: number = React.useMemo(() => {
		return parseFloat(amount) - sharedAmount || 0;
	}, [amount, sharedAmount]);

	return (
		<Box>
			<Text fontSize={"sm"} fontWeight={"semibold"} mb={4}>
				Your split = {yourSplit}
			</Text>
			<Text fontSize="lg" fontWeight={"semibold"}>
				Final Amount
			</Text>
			<Text fontSize="xl" fontWeight={"extrabold"}>
				{parseAmount(yourSplit + sharedAmount)}
			</Text>
		</Box>
	);
};

export const ExpenseEditModal = ({ onClose, isOpen, data }: Props) => {
	const cookies = new Cookies();
	const toast = useToast();
	const queryClient = useQueryClient();

	const deleteExpenseMutation = useMutation({
		mutationFn: (expneseId: number) =>
			axiosRequest.delete(`/expenses/${expneseId}/delete`),
		onSuccess: () => {
			queryClient.invalidateQueries("expenses");
			queryClient.invalidateQueries("sharedExpenses");
			queryClient.invalidateQueries("oweExpenses");
			queryClient.invalidateQueries("activeSettleExpense");
			toast({
				title: "Deleted!",
				description: "Expense deleted successfully.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
			onClose();
		},
		onError: (err: any) => {
			toast({
				title: "Error!",
				description: err?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		},
	});

	const deleteSharedExpenseMutation = useMutation({
		mutationFn: (sharedExpenseId: number) =>
			axiosRequest.delete(`/expenses/shared/${sharedExpenseId}/delete`),
		onSuccess: () => {
			queryClient.invalidateQueries("expenses");
			queryClient.invalidateQueries("sharedExpenses");
			queryClient.invalidateQueries("oweExpenses");
			queryClient.invalidateQueries("activeSettleExpense");
			toast({
				title: "Removed!",
				description: "Removed successfully.",
				status: "success",
				duration: 3000,
				isClosable: true,
			});
		},
		onError: (err: any) => {
			toast({
				title: "Error!",
				description: err?.response?.data?.message,
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		},
	});

	const { data: friendsList, isLoading } = useQuery(
		"friends",
		() => axiosRequest.get("/friends/").then((res) => res.data),
		{
			refetchOnWindowFocus: false,
		}
	);

	const handleExpenseDeleteMutation = (expenseId: number) => {
		deleteExpenseMutation.mutate(expenseId);
	};
	const handleSharedExpenseDeleteMutation = (sharedExpenseId: number) => {
		deleteSharedExpenseMutation.mutate(sharedExpenseId);
	};

	const excludeFields = (data: any[], fields: string[]): any[] => {
		return data.map((item) => {
			const newItem = { ...item };
			for (const field of fields) {
				delete newItem[field];
			}
			return newItem;
		});
	};

	const handleSharedExpenses = (data: any): any[] => {
		let payload: any[] = [];

		data!?.shared_expenses.map((sharedExpense, index) => {
			let requiredData = {
				id: 0,
				loaner_name: "",
				loaner_username: "",
				loaner_id: 0,
				amount: 0,
				status: "UP",
			};

			requiredData.id = sharedExpense.id;
			requiredData.amount = sharedExpense.amount;
			requiredData.loaner_id = sharedExpense.loaner.id;
			requiredData.loaner_name = sharedExpense.loaner.full_name;
			requiredData.loaner_username = sharedExpense.loaner.username;
			requiredData.status = sharedExpense.status;

			payload.push(requiredData);
		});

		return payload;
	};

	const {
		control,
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<IFormData>({
		values: {
			id: data!?.id,
			amount: data!?.amount,
			description: data!?.description,
			create_dt: data!?.create_dt,
			update_dt: data!?.update_dt,
			shared_expenses: handleSharedExpenses(data),
		},
		mode: "all",
		// shouldUnregister: true,
	});

	const {
		fields: fieldsArray,
		append,
		remove,
		update,
	} = useFieldArray({
		control,
		name: "shared_expenses",
		keyName: "fieldArrID",
	});

	const updateMutation = useMutation({
		mutationFn: (formData: IFormData) =>
			axiosRequest.put(`/expenses/${data.id}/update`, formData),
		onSuccess: () => {
			queryClient.invalidateQueries("expenses");
			queryClient.invalidateQueries("sharedExpenses");
			queryClient.invalidateQueries("oweExpenses");
			queryClient.invalidateQueries("activeSettleExpense");
			toast({
				title: "Updated!",
				description: "Expense updated successfully.",
				status: "success",
				duration: 2500,
				isClosable: true,
			});
			onClose();
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

	const handleUpdateFormSubmit: SubmitHandler<IFormData> = (data) => {
		updateMutation.mutate(data);
	};

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Update Expense</ModalHeader>
					<ModalCloseButton _focus={{ outline: "none" }} />
					<ModalBody mb={2}>
						<form
							onSubmit={handleSubmit(handleUpdateFormSubmit)}
							encType="multipart/form-data"
						>
							<input
								type="hidden"
								name="csrfmiddlewaretoken"
								value={cookies.get("csrftoken")}
							/>
							<Flex direction={"column"} gap="5" rounded={"md"}>
								<FormControl>
									<FormLabel>Description</FormLabel>
									<Input {...register("description", {})} />
								</FormControl>

								<Controller
									control={control}
									name="amount"
									render={({ field }) => (
										<FormControl>
											<FormLabel>Amount</FormLabel>
											<NumberInput
												{...field}
												onChange={(val) => field.onChange(parseFloat(val))}
												step={200}
												min={0}
											>
												<NumberInputField />
												<NumberInputStepper>
													<NumberIncrementStepper />
													<NumberDecrementStepper />
												</NumberInputStepper>
											</NumberInput>
										</FormControl>
									)}
								/>

								{fieldsArray!?.map((arrayField, index) => (
									<Flex gap="4" mb="4" key={arrayField.fieldArrID}>
										<Controller
											control={control}
											name={`shared_expenses.${index}.loaner_id` as const}
											rules={{ required: true }}
											render={({ field }) => (
												<Select required={true} {...field}>
													{!isLoading &&
														friendsList!.map((item, index) => (
															<option
																value={parseInt(item.friend.id)}
																key={index}
															>
																{item.friend.full_name}
															</option>
														))}
												</Select>
											)}
										/>
										<Controller
											control={control}
											name={`shared_expenses.${index}.amount` as const}
											render={({ field }) => (
												<NumberInput
													step={100}
													defaultValue={0}
													min={0}
													{...field}
													onChange={(val) => field.onChange(parseFloat(val))}
												>
													<NumberInputField required={true} />
													<NumberInputStepper>
														<NumberIncrementStepper />
														<NumberDecrementStepper />
													</NumberInputStepper>
												</NumberInput>
											)}
										/>
										<Menu>
											<MenuButton
												p="2"
												as={Button}
												color={useColorModeValue("white", "gray.700")}
												_hover={{
													bg:
														arrayField.status === "P"
															? useColorModeValue("green.600", "green.300")
															: useColorModeValue("red.600", "red.300"),
												}}
												_active={{
													bg:
														arrayField.status === "P"
															? useColorModeValue("green.600", "green.300")
															: useColorModeValue("red.600", "red.300"),
												}}
												bg={
													arrayField.status === "P"
														? useColorModeValue("green.500", "green.200")
														: useColorModeValue("red.500", "red.200")
												}
											>
												<Icon
													as={FiChevronDown}
													size="4"
													boxSize={"4"}
													mt="1"
												/>
											</MenuButton>
											<MenuList px="2">
												<MenuItem
													rounded={"md"}
													border="none"
													_hover={{
														border: "none",
													}}
													onClick={() =>
														update(index, {
															...arrayField,
															status: arrayField.status === "P" ? "UP" : "P",
														})
													}
												>
													Mark {arrayField.status === "P" ? "Unpaid" : "Paid"}
												</MenuItem>
												<MenuItem
													color={useColorModeValue("red.600", "red.300")}
													rounded={"md"}
													border="none"
													_hover={{
														border: "none",
													}}
													onClick={() => {
														handleSharedExpenseDeleteMutation(arrayField.id!);
														remove(index);
													}}
												>
													Remove
												</MenuItem>
											</MenuList>
										</Menu>
									</Flex>
								))}
								<Button
									leftIcon={<HiPlus />}
									onClick={() =>
										append({
											loaner_id: 0,
											amount: "0",
											status: "UP",
										})
									}
								>
									Add Split
								</Button>
								<Flex justifyContent={"space-between"} alignItems={"center"}>
									<TotalAmount control={control} amount={watch("amount")!} />
									<Flex alignSelf={"flex-end"} mb={1}>
										<Button
											colorScheme={"red"}
											variant="ghost"
											mr="3"
											isLoading={deleteExpenseMutation.isLoading}
											onClick={() => handleExpenseDeleteMutation(data?.id)}
										>
											Delete
										</Button>
										<Button
											colorScheme={"telegram"}
											type="submit"
											isLoading={updateMutation.isLoading}
										>
											Save
										</Button>
									</Flex>
								</Flex>
							</Flex>
						</form>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};
