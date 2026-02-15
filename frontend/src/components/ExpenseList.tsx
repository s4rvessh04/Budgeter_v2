import React, { useEffect, useState } from "react";
import shallow from "zustand/shallow";
import { useQuery } from "react-query";

import { OweModal, SettleModal } from "../components";
import { parseAmount } from "../utils";
import { axiosRequest } from "../utils/axiosInstance";
import { useOweExpenseStore, useSettleExpenseStore } from "../stores";

import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const ExpenseList = () => {
	// We'll manage modal state locally
	const [isOweModalOpen, setIsOweModalOpen] = useState(false);
	const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);

	const [selectedOweExpense, setSelectedOweExpense] = React.useState();
	const [selectedSettleExpense, setSelectedSettleExpense] = React.useState();

	const [activeTab, setActiveTab] = useState<"settle" | "owe">("settle");
	const [activePanelData, setActivePanelData] = useState<any>([]);

	const [
		sumOweExpenseAmount,
		updateSumOweExpenseAmount,
	] = useOweExpenseStore(
		(state) => [
			state.sumOweExpensesAmount,
			state.updateSumOweExpensesAmount,
		],
		shallow
	);

	const [
		sumSettleExpensesAmount,
		updateSumSettleExpenseAmount,
	] = useSettleExpenseStore(
		(state) => [
			state.sumSettleExpensesAmount,
			state.updateSumSettleExpensesAmount,
		],
		shallow
	);

	const { data: settleExpensesData, isLoading: settleExpensesLoading } =
		useQuery({
			queryKey: "sharedExpenses",
			enabled: activeTab === "settle",
			queryFn: () =>
				axiosRequest.get("/expenses/shared/").then((res) => res.data?.results ?? res.data),
		});

	const { data: oweExpensesData, isLoading: oweExpensesLoading } = useQuery({
		queryKey: "oweExpenses",
		enabled: activeTab === "owe",
		queryFn: () =>
			axiosRequest.get("/expenses/shared/owe/").then((res) => res.data?.results ?? res.data),
	});

	useEffect(() => {
		function handleCurrentData(data: any[]) {
			let processedData: any[] = [];

			data.forEach((item) => {
				let userData = {
					user: {},
					expenses: [],
					expensesSum: 0,
				};

				const userSumAmount = item.expenses.reduce(
					(prev: any, curr: any) =>
						parseFloat(prev) +
						parseFloat(curr.status === "UP" ? curr.amount : 0),
					0
				);

				if (item.owner !== undefined) userData.user = item.owner;
				if (item.loaner !== undefined) userData.user = item.loaner;

				userData.expensesSum = userSumAmount;
				userData.expenses = item.expenses;

				processedData.push(userData);
			});

			return processedData;
		}

		if (activeTab === "owe" && !oweExpensesLoading && oweExpensesData) {
			const data = handleCurrentData(oweExpensesData);
			const sum = data.reduce(
				(prev, curr) => parseFloat(prev) + parseFloat(curr.expensesSum),
				0
			);
			updateSumOweExpenseAmount(sum as number);
			setActivePanelData(data);
		}
		if (activeTab === "settle" && !settleExpensesLoading && settleExpensesData) {
			const data = handleCurrentData(settleExpensesData);
			const sum = data.reduce(
				(prev, curr) => parseFloat(prev) + parseFloat(curr.expensesSum),
				0
			);
			updateSumSettleExpenseAmount(sum as number);
			setActivePanelData(data);
		}

		return;
	}, [
		oweExpensesData,
		settleExpensesData,
		activeTab,
		oweExpensesLoading,
		settleExpensesLoading,
		updateSumOweExpenseAmount,
		updateSumSettleExpenseAmount
	]);

	const renderList = (type: "settle" | "owe") => (
		<div className="flex flex-col h-full">
			<div className="flex-1 overflow-auto">
				{activePanelData?.map((item: any, idx: number) => (
					<div
						key={idx}
						onClick={() => {
							if (type === "settle") {
								setSelectedSettleExpense(item);
								setIsSettleModalOpen(true);
							} else {
								setSelectedOweExpense(item);
								setIsOweModalOpen(true);
							}
						}}
						className="grid grid-cols-4 gap-4 px-4 py-4 border-b hover:bg-muted/50 cursor-pointer transition-colors"
					>
						<div className="col-span-3 flex items-center justify-start font-medium truncate">
							{item?.user.full_name}
						</div>
						<div className="col-span-1 flex items-center justify-end font-semibold">
							{parseAmount(item.expensesSum)}
						</div>
					</div>
				))}
			</div>
			<div className="sticky bottom-0 bg-background border-t p-4 text-xs font-bold uppercase text-muted-foreground grid grid-cols-4 gap-4">
				<div className="col-span-3 flex items-center justify-start">
					Total
				</div>
				<div className="col-span-1 flex items-center justify-end font-semibold text-foreground">
					{parseAmount(type === "settle" ? sumSettleExpensesAmount : sumOweExpenseAmount)}
				</div>
			</div>
		</div>
	);

	return (
		<>
			<Tabs
				defaultValue="settle"
				className="h-full flex flex-col"
				onValueChange={(val) => setActiveTab(val as "settle" | "owe")}
			>
				<div className="px-4 pt-4">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="settle">Settle</TabsTrigger>
						<TabsTrigger value="owe">Owe</TabsTrigger>
					</TabsList>
				</div>
				<TabsContent value="settle" className="flex-1 overflow-hidden mt-0">
					{renderList("settle")}
				</TabsContent>
				<TabsContent value="owe" className="flex-1 overflow-hidden mt-0">
					{renderList("owe")}
				</TabsContent>
			</Tabs>

			<OweModal
				onClose={() => setIsOweModalOpen(false)}
				isOpen={isOweModalOpen}
				data={selectedOweExpense}
			/>
			<SettleModal
				onClose={() => setIsSettleModalOpen(false)}
				isOpen={isSettleModalOpen}
				data={selectedSettleExpense}
			/>
		</>
	);
};
