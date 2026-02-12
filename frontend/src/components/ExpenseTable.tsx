import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { User, Users, Search, Filter } from "lucide-react";
import shallow from "zustand/shallow";

import { useExpenseStore } from "../stores";
import {
	axiosRequest,
	handleDefault,
	parseDate,
} from "../utils";

import { ExpenseEditModal } from "./ExpenseEditModal";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface IExpense {
	id: number;
	description: string;
	amount: string;
	create_dt: string;
	update_dt: string;
	shared_expenses: any[];
}

export const ExpenseTable = () => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [modalData, setModalData] = useState<IExpense>();
	const [searchQuery, setSearchQuery] = useState("");
	const [filterType, setFilterType] = useState<"all" | "shared" | "self">("all");

	const [sumExpensesAmount, updateSumExpensesAmount] = useExpenseStore(
		(state) => [state.sumExpensesAmount, state.updateSumExpensesAmount],
		shallow
	);

	const { isLoading, data, isFetching } = useQuery(
		["expenses"],
		() => axiosRequest.get("/expenses/").then((res) => res.data?.results ?? res.data),
		{
			refetchOnWindowFocus: false,
		}
	);

	const filteredData = useMemo(() => {
		if (!data) return [];
		return data.filter((expense: IExpense) => {
			const { date, time } = parseDate(expense.create_dt);
			const type = expense.shared_expenses.length > 0 ? "shared" : "self";
			const searchLower = searchQuery.toLowerCase();

			const matchesSearch =
				expense.description.toLowerCase().includes(searchLower) ||
				expense.amount.toString().includes(searchLower) ||
				date.toLowerCase().includes(searchLower) ||
				time.toLowerCase().includes(searchLower) ||
				type.includes(searchLower);

			const isShared = expense.shared_expenses.length > 0;

			if (filterType === "shared" && !isShared) return false;
			if (filterType === "self" && isShared) return false;

			return matchesSearch;
		});
	}, [data, searchQuery, filterType]);

	const calcExpensesSum = React.useCallback(
		(expenses: IExpense[]) =>
			handleDefault<number>(
				parseFloat(
					expenses
						?.reduce(
							(prev: any, curr: any) => prev + parseFloat(curr.amount),
							0
						)
						.toFixed(2)
				),
				0
			),
		[]
	);

	React.useEffect(() => {
		if (!isFetching && filteredData) {
			const expensesSum = calcExpensesSum(filteredData);
			updateSumExpensesAmount(expensesSum);
		}
	}, [isFetching, filteredData, calcExpensesSum, updateSumExpensesAmount]);

	function handleModalData(data: IExpense): void {
		setModalData(data);
		setIsModalOpen(true);
	}

	// Typewriter effect for placeholder
	const [placeholder, setPlaceholder] = useState("");
	const [isDeleting, setIsDeleting] = useState(false);
	const [loopNum, setLoopNum] = useState(0);
	const [typingSpeed, setTypingSpeed] = useState(150);

	React.useEffect(() => {
		const examples = ["'Groceries'", "'500'", "'October'", "'Shared'", "'2023'", "'Dinner'"];
		const i = loopNum % examples.length;
		const fullText = `Search ${examples[i]}...`;

		const handleType = () => {
			setPlaceholder(
				isDeleting
					? fullText.substring(0, placeholder.length - 1)
					: fullText.substring(0, placeholder.length + 1)
			);

			setTypingSpeed(isDeleting ? 30 : 150);

			if (!isDeleting && placeholder === fullText) {
				setTimeout(() => setIsDeleting(true), 2000);
			} else if (isDeleting && placeholder === "") {
				setIsDeleting(false);
				setLoopNum(loopNum + 1);
			}
		};

		const timer = setTimeout(handleType, typingSpeed);
		return () => clearTimeout(timer);
	}, [placeholder, isDeleting, loopNum, typingSpeed]);

	return (
		<>
			<div className="flex flex-col sm:flex-row gap-4 m-4">
				<div className="relative flex-1">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={placeholder}
						className="pl-9"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="w-full sm:w-[180px]">
					<Select value={filterType} onValueChange={(val: any) => setFilterType(val)}>
						<SelectTrigger>
							<div className="flex items-center gap-2">
								<Filter className="h-4 w-4" />
								<SelectValue placeholder="Filter by type" />
							</div>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Expenses</SelectItem>
							<SelectItem value="shared">Shared</SelectItem>
							<SelectItem value="self">Self</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="rounded-md bg-card overflow-hidden">
				<div className="overflow-x-auto">
					<Table className="min-w-[600px]">
						<TableHeader>
							<TableRow>
								<TableHead>Date</TableHead>
								<TableHead>Description</TableHead>
								<TableHead>Type</TableHead>
								<TableHead className="text-right">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading || isFetching ? (
								Array.from({ length: 7 }).map((_, idx) => (
									<TableRow key={idx}>
										<TableCell><Skeleton className="h-6 w-20" /></TableCell>
										<TableCell><Skeleton className="h-6 w-32" /></TableCell>
										<TableCell><Skeleton className="h-6 w-16" /></TableCell>
										<TableCell><Skeleton className="h-6 w-16 ml-auto" /></TableCell>
									</TableRow>
								))
							) : filteredData && filteredData.length > 0 ? (
								filteredData.map((expense: IExpense, idx: number) => (
									<TableRow
										key={idx}
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => handleModalData(expense)}
									>
										<TableCell>
											<div className="font-medium">{parseDate(expense.create_dt).date}</div>
											<div className="text-xs text-muted-foreground">{parseDate(expense.create_dt).time}</div>
										</TableCell>
										<TableCell className="max-w-[200px] font-medium truncate">
											{expense.description}
										</TableCell>
										<TableCell>
											<Badge variant="secondary" className="gap-1 rounded-full px-3">
												{expense.shared_expenses.length > 0 ? (
													<>
														<Users className="h-3 w-3" /> Shared
													</>
												) : (
													<>
														<User className="h-3 w-3" /> Self
													</>
												)}
											</Badge>
										</TableCell>
										<TableCell className="text-right font-bold">
											₹{expense.amount}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
										No Expenses Found!
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<div className="flex items-center justify-between border-t p-4 font-medium bg-muted/20">
				<div className="flex gap-4">
					<span>ITEMS: {filteredData?.length || 0}</span>
				</div>
				<div className="flex gap-4">
					<span>TOTAL: ₹{sumExpensesAmount}</span>
				</div>
			</div>

			<ExpenseEditModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				data={modalData}
			/>
		</>
	);
};
