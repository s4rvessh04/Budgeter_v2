import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { AlertCircle, CheckCircle } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { axiosRequest, parseAmount, parseDate } from "../utils";
import { ExpenseEditModal } from "./ExpenseEditModal";

interface Props {
	onClose: () => void;
	isOpen: boolean;
	data?: any;
}

export const SettleModal = ({ onClose, isOpen, data }: Props) => {
	const queryClient = useQueryClient();
	const [activeExpenseId, setActiveExpenseId] = useState<number | undefined>(undefined);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	const { data: settleExpenseData } = useQuery({
		queryKey: ["activeSettleExpense", activeExpenseId],
		enabled: activeExpenseId !== undefined,
		queryFn: () =>
			axiosRequest
				.get(`/expenses/${activeExpenseId}`)
				.then((res) => res.data),
		onSuccess: () => {
			queryClient.invalidateQueries("sharedExpenses");
			queryClient.invalidateQueries("expenses");
		},
	});

	const handleExpenseClick = (id: number) => {
		setActiveExpenseId(id);
		setIsEditModalOpen(true);
		// We don't close SettleModal here as per Shadcn Dialog interaction, 
		// but stacking Modals might be tricky. 
		// Ideally SettleModal closes or we just keep both open.
		// The original code closed SettleModal.
		onClose();
	}

	return (
		<>
			<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
				<DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex justify-between items-center pr-8">
							<span>{data?.user?.full_name}</span>
							<span className="text-lg font-bold">{parseAmount(data?.expensesSum)}</span>
						</DialogTitle>
					</DialogHeader>
					<div className="space-y-3 py-4">
						{data?.expenses?.map((expense: any, idx: number) => (
							<div
								key={idx}
								onClick={() => handleExpenseClick(expense.expense.id)}
								className="cursor-pointer rounded-md bg-muted/50 px-3 py-2 hover:bg-muted/80 transition-colors"
							>
								<div className="mb-1 text-sm text-muted-foreground capitalize">
									{parseDate(expense?.create_dt).date}
								</div>
								<div className="font-medium">
									{expense?.expense.description}
								</div>
								<div className="mt-2 flex items-center justify-between">
									<div className="text-lg font-semibold">
										₹{expense?.amount}
									</div>
									<Badge
										variant={expense?.status === "UP" ? "destructive" : "default"}
										className="gap-1 rounded-full px-2"
									>
										{expense?.status === "UP" ? (
											<>
												<AlertCircle className="h-3 w-3" /> Unpaid
											</>
										) : (
											<>
												<CheckCircle className="h-3 w-3" /> Paid
											</>
										)}
									</Badge>
								</div>
							</div>
						))}
					</div>
				</DialogContent>
			</Dialog>

			<ExpenseEditModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				data={settleExpenseData}
			/>
		</>
	);
};
