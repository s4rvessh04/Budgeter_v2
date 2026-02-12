import React from "react";
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
import { Plus, Trash } from "lucide-react";

import { axiosRequest, parseAmount } from "../utils";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

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
		const sum = formData?.reduce((acc, cur) => acc + (cur.amount || 0), 0) ?? 0;
		return sum;
	}, [formData]);

	const yourSplit: number = React.useMemo(() => {
		return amount - sharedAmount || 0;
	}, [amount, sharedAmount]);

	return (
		<div className="rounded-lg border bg-muted/50 p-4">
			<div className="flex justify-between text-sm font-medium">
				<span>Your Split</span>
				<span>{yourSplit}</span>
			</div>
			<div className="mt-2 flex justify-between text-lg font-bold">
				<span>Final Amount</span>
				<span>{parseAmount(yourSplit + sharedAmount)}</span>
			</div>
		</div>
	);
};

export const NewExpenseModal = ({ onClose, isOpen }: Props) => {
	const cookies = new Cookies();
	const { toast } = useToast();
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

	const { data: friendsData } = useQuery(
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
				variant: "default",
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
				description: err?.response?.data ?? "An unexpected error occurred.",
				variant: "destructive",
			});
		},
	});

	const handleFormSubmit: SubmitHandler<IFormData> = (data) => {
		mutation.mutate(data);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Add Expense</DialogTitle>
				</DialogHeader>
				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
					<input
						type="hidden"
						name="csrfmiddlewaretoken"
						value={cookies.get("csrftoken")}
					/>

					<div className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Input
								id="description"
								placeholder="Enter description"
								{...register("description", { required: true })}
								className={cn(errors.description && "border-red-500")}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="amount">Amount</Label>
							<Input
								id="amount"
								type="number"
								step="0.01"
								placeholder="0.00"
								{...register("amount", { required: true, valueAsNumber: true })}
								className={cn(errors.amount && "border-red-500")}
							/>
						</div>

						<div className="space-y-4">
							<Label>Splits</Label>
							{fields.map((field, index) => (
								<div key={field.id} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
									<div className="flex-1 w-full">
										<Controller
											control={control}
											name={`shared_expenses.${index}.loaner_id`}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<Select onValueChange={(val) => onChange(parseInt(val))} value={value?.toString()}>
													<SelectTrigger className="w-full">
														<SelectValue placeholder="Select Friend" />
													</SelectTrigger>
													<SelectContent>
														{friendsData?.map((item: any) => (
															<SelectItem key={item.friend.id} value={item.friend.id.toString()}>
																{item.friend.full_name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
									</div>
									<div className="flex w-full sm:w-auto gap-2">
										<div className="flex-1 sm:w-[120px]">
											<Input
												type="number"
												step="1"
												placeholder="Amount"
												{...register(`shared_expenses.${index}.amount` as const, { valueAsNumber: true, required: true })}
											/>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => remove(index)}
											className="text-red-500 hover:text-red-600 hover:bg-red-50"
										>
											<Trash className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="w-full border-dashed"
								onClick={() => append({ loaner_id: 0, amount: 0, status: "UP" })}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Split
							</Button>
						</div>

						<TotalAmount control={control} amount={watch("amount")} />
					</div>

					<div className="flex justify-end">
						<Button type="submit" disabled={mutation.isLoading} className="w-full sm:w-auto">
							{mutation.isLoading && (
								<span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
							)}
							Save Expense
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
