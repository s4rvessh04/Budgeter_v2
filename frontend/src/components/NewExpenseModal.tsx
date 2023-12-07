import React from "react";
import {
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	IconButton,
	Input,
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
	useToast,
} from "@chakra-ui/react";
import { HiTrash, HiPlus } from "react-icons/hi";
import {
	useForm,
	useFieldArray,
	SubmitHandler,
	Control,
	useWatch,
	Controller,
} from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Cookies } from "react-cookie";
import { axiosRequest, parseAmount } from "../utils";

interface Props {
	onClose: () => void;
	isOpen: boolean;
}

interface ISharedExpense {
	loaner_id: number;
	amount: number;
	status: "P" | "UP";
}

interface IFormData {
	description: string;
	amount: number;
	is_shared: boolean;
	shared_expenses: ISharedExpense[];
}

const TotalAmount = ({
	control,
	amount,
}: {
	control: Control<IFormData>;
	amount: number;
}) => {
	const formData = useWatch({
		name: "shared_expenses",
		control,
	});

	const sharedAmount: number = React.useMemo(() => {
		const sum = formData.reduce((acc, cur) => acc + (cur.amount || 0), 0);
		return sum;
	}, [formData]);

	const yourSplit: number = React.useMemo(() => {
		return amount - sharedAmount || 0;
	}, [amount, sharedAmount]);

	return (
		<Box>
			<Text fontSize={"sm"} fontWeight={"semibold"} mb={4}>
				Your Split = {yourSplit}
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

export const NewExpenseModal = ({ onClose, isOpen }: Props) => {
	const cookies = new Cookies();

	const toast = useToast();
	const queryClient = useQueryClient();
	const {
		control,
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<IFormData>({
		defaultValues: {
			description: "",
			amount: 0,
			shared_expenses: [],
		},
		mode: "onBlur",
	});
	const { fields, append, remove } = useFieldArray({
		control,
		name: "shared_expenses",
	});

	const { data, isLoading, error } = useQuery(
		"friends",
		() => axiosRequest.get("/friends/").then((res) => res.data),
		{
			refetchOnWindowFocus: false,
		}
	);

	const mutation = useMutation({
		mutationFn: (formData: IFormData) =>
			axiosRequest.post("/expenses/", formData),
		onSuccess: () => {
			queryClient.invalidateQueries("expenses");
			queryClient.invalidateQueries("sharedExpenses");
			queryClient.invalidateQueries("oweExpenses");
			toast({
				title: "Expense Added!",
				description: "Expense added successfully.",
				status: "success",
				duration: 2500,
				isClosable: true,
			});
			reset({
				description: "",
				amount: 0,
				shared_expenses: [],
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

	const handleFormSubmit: SubmitHandler<IFormData> = (data) => {
		console.log("New expense", data);
		mutation.mutate(data);
	};

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Add Expense</ModalHeader>
				<ModalCloseButton _focus={{ outline: "none" }} />
				<ModalBody mb={2}>
					<form
						onSubmit={handleSubmit(handleFormSubmit)}
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
									{...register("description", {
										required: true,
									})}
								/>
							</FormControl>

							<Controller
								control={control}
								name="amount"
								render={({ field }) => (
									<FormControl isRequired>
										<FormLabel>Amount</FormLabel>
										<NumberInput
											{...field}
											onChange={(val) => field.onChange(parseFloat(val))}
											step={200}
											defaultValue={0}
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

							{fields.map((field, index) => (
								<Flex gap="4" mb="4" key={field.id}>
									<Select
										required={true}
										{...register(
											`shared_expenses.${index}.loaner_id` as const,
											{
												required: true,
												valueAsNumber: true,
											}
										)}
										defaultValue={field.loaner_id}
									>
										<option defaultValue={"-"} defaultChecked={true}>
											-
										</option>
										{data.map((item, index) => (
											<option value={item.friend.id} key={index}>
												{item.friend.full_name}
											</option>
										))}
									</Select>
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
									<IconButton
										aria-label="Delete"
										icon={<HiTrash />}
										onClick={() => remove(index)}
									/>
								</Flex>
							))}
							<Button
								leftIcon={<HiPlus />}
								onClick={() =>
									append({
										loaner_id: 0,
										amount: 0,
										status: "UP",
									})
								}
							>
								Add Split
							</Button>

							<Flex justifyContent={"space-between"} alignItems="center">
								<TotalAmount control={control} amount={watch("amount")} />
								<Button
									alignSelf={"flex-end"}
									mb={1}
									colorScheme={"telegram"}
									type="submit"
									isLoading={mutation.isLoading}
								>
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
