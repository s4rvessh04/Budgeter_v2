import React, { useEffect } from "react";
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
import { ChevronDown, Plus, Trash } from "lucide-react";

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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

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
	amount?: string | number;
	expense?: number;
}

interface IFormData {
	id?: number;
	description?: string;
	create_dt?: string;
	update_dt?: string;
	amount?: string | number;
	shared_expenses?: ISharedExpense[];
}

const TotalAmount = ({
	control,
	amount,
}: {
	control: Control<IFormData>;
	amount: string | number;
}) => {
	const formData = useWatch({
		name: "shared_expenses",
		control,
	});

	const sharedAmount: number = React.useMemo(() => {
		const sum = formData?.reduce((acc, cur) => acc + (parseFloat(cur.amount?.toString() || "0") || 0), 0) ?? 0;
		return sum;
	}, [formData]);

	const yourSplit: number = React.useMemo(() => {
		return (parseFloat(amount?.toString() || "0")) - sharedAmount || 0;
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

export const ExpenseEditModal = ({ onClose, isOpen, data }: Props) => {
	const cookies = new Cookies();
	const { toast } = useToast();
	const queryClient = useQueryClient();

	const deleteExpenseMutation = useMutation({
		mutationFn: (expenseId: number) =>
			axiosRequest.delete(`/expenses/${expenseId}/delete`),
		onSuccess: () => {
			queryClient.invalidateQueries("expenses");
			queryClient.invalidateQueries("sharedExpenses");
			queryClient.invalidateQueries("oweExpenses");
			queryClient.invalidateQueries("activeSettleExpense");
			toast({
				title: "Deleted!",
				description: "Expense deleted successfully.",
				variant: "default",
			});
			onClose();
		},
		onError: (err: any) => {
			toast({
				title: "Error!",
				description: err?.response?.data?.message,
				variant: "destructive",
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
				variant: "default",
			});
		},
		onError: (err: any) => {
			toast({
				title: "Error!",
				description: err?.response?.data?.message,
				variant: "destructive",
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

	const handleSharedExpenses = (data: any): any[] => {
		if (!data?.shared_expenses) return [];

		let payload: any[] = [];
		data.shared_expenses.map((sharedExpense: any) => {
			let requiredData = {
				id: sharedExpense.id,
				amount: sharedExpense.amount,
				loaner_id: sharedExpense.loaner.id,
				loaner_name: sharedExpense.loaner.full_name,
				loaner_username: sharedExpense.loaner.username,
				status: sharedExpense.status,
			};
			payload.push(requiredData);
		});

		return payload;
	};

	const {
		control,
		register,
		handleSubmit,
		watch,
		reset,
		formState: { errors },
	} = useForm<IFormData>({
		defaultValues: {
			id: data?.id,
			amount: data?.amount,
			description: data?.description,
			create_dt: data?.create_dt,
			update_dt: data?.update_dt,
			shared_expenses: handleSharedExpenses(data),
		},
		mode: "all",
	});

	// Reset form when data changes (e.g. opening modal with different expense)
	useEffect(() => {
		if (data) {
			reset({
				id: data.id,
				amount: data.amount,
				description: data.description,
				create_dt: data.create_dt,
				update_dt: data.update_dt,
				shared_expenses: handleSharedExpenses(data),
			});
		}
	}, [data, reset]);

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
				variant: "default",
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

	const handleUpdateFormSubmit: SubmitHandler<IFormData> = (data) => {
		updateMutation.mutate(data);
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Update Expense</DialogTitle>
				</DialogHeader>
				<form
					onSubmit={handleSubmit(handleUpdateFormSubmit)}
					className="space-y-6 py-4"
				>
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
								{...register("description", {})}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="amount">Amount</Label>
							<Input
								id="amount"
								type="number"
								step="0.01"
								{...register("amount", { valueAsNumber: true })}
							/>
						</div>

						<div className="space-y-4">
							<Label>Splits</Label>
							{fieldsArray?.map((arrayField, index) => (
								<div key={arrayField.fieldArrID} className="flex gap-2 items-start">
									<div className="flex-1">
										<Controller
											control={control}
											name={`shared_expenses.${index}.loaner_id`}
											rules={{ required: true }}
											render={({ field: { onChange, value } }) => (
												<Select onValueChange={(val) => onChange(parseInt(val))} value={value?.toString()}>
													<SelectTrigger>
														<SelectValue placeholder="Select Friend" />
													</SelectTrigger>
													<SelectContent>
														{!isLoading && friendsList?.map((item: any, idx: number) => (
															<SelectItem key={idx} value={item.friend.id.toString()}>
																{item.friend.full_name}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
									</div>
									<div className="w-[120px]">
										<Input
											type="number"
											step="1"
											placeholder="Amount"
											{...register(`shared_expenses.${index}.amount` as const, { valueAsNumber: true, required: true })}
										/>
									</div>

									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="outline"
												size="icon"
												className={cn(
													arrayField.status === "P" ? "bg-green-100 hover:bg-green-200 dark:bg-green-900/20" : "bg-red-100 hover:bg-red-200 dark:bg-red-900/20"
												)}
											>
												<ChevronDown className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() =>
													update(index, {
														...arrayField,
														status: arrayField.status === "P" ? "UP" : "P",
													})
												}
											>
												Mark {arrayField.status === "P" ? "Unpaid" : "Paid"}
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-red-600 focus:text-red-600"
												onClick={() => {
													if (arrayField.id) handleSharedExpenseDeleteMutation(arrayField.id);
													remove(index);
												}}
											>
												Remove
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							))}
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="w-full border-dashed"
								onClick={() =>
									append({
										loaner_id: 0,
										amount: 0,
										status: "UP",
									})
								}
							>
								<Plus className="mr-2 h-4 w-4" />
								Add Split
							</Button>
						</div>

						<div className="flex items-center justify-between pt-4">
							<div className="flex-1 mr-4">
								<TotalAmount control={control} amount={watch("amount") || 0} />
							</div>
							<div className="flex flex-col gap-2">
								<Button
									type="button"
									variant="destructive"
									onClick={() => handleExpenseDeleteMutation(data?.id)}
									disabled={deleteExpenseMutation.isLoading}
								>
									Delete
								</Button>
								<Button
									type="submit"
									disabled={updateMutation.isLoading}
								>
									Save
								</Button>
							</div>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};
