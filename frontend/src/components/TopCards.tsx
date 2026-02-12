import { useExpenseStore } from "../stores";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

export const TopCards = () => {
	const expenseAmount = useExpenseStore((state) => state.sumExpensesAmount);

	const cards = [
		{
			key: "a",
			title: "Expense",
			amount: `₹${expenseAmount}`,
		},
		{
			key: "b",
			title: "Balance",
			amount: "—",
		},
		{
			key: "c",
			title: "Avg. Monthly Spending",
			amount: "—",
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-3 mb-5">
			{cards.map((item) => (
				<Card key={item.key}>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
						<CardTitle className="text-sm font-medium">
							{item.title}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{item.amount}</div>
						{/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
					</CardContent>
				</Card>
			))}
		</div>
	);
};
