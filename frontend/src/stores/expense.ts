import create from "zustand";

interface ExpenseState {
	sumExpensesAmount: number;
	updateSumExpensesAmount: (value: number) => void;
}

interface OweExpenseState {
	sumOweExpensesAmount: number;
	updateSumOweExpensesAmount: (value: number) => void;
}

interface SettleExpenseState {
	sumSettleExpensesAmount: number;
	updateSumSettleExpensesAmount: (value: number) => void;
}

interface BalanceState {
	balanceAmount: number;
	updateBalanceAmount: (value: number) => void;
}

interface AvgMonthlySpendState {
	avgMonthlySpendAmount: number;
	updateAvgMonthlySpendAmount: (value: number) => void;
}

export const useExpenseStore = create<ExpenseState>()((set) => ({
	sumExpensesAmount: 0,
	updateSumExpensesAmount: (value: number) =>
		set(() => ({ sumExpensesAmount: value })),
}));

export const useOweExpenseStore = create<OweExpenseState>()((set) => ({
	sumOweExpensesAmount: 0,
	updateSumOweExpensesAmount: (value: number) =>
		set(() => ({ sumOweExpensesAmount: value })),
}));

export const useSettleExpenseStore = create<SettleExpenseState>()((set) => ({
	sumSettleExpensesAmount: 0,
	updateSumSettleExpensesAmount: (value: number) =>
		set(() => ({ sumSettleExpensesAmount: value })),
}));

export const useBalanceStore = create<BalanceState>()((set) => ({
	balanceAmount: 0,
	updateBalanceAmount: (value: number) =>
		set(() => ({ balanceAmount: value })),
}));

export const useAvgMonthlySpend = create<AvgMonthlySpendState>()((set) => ({
	avgMonthlySpendAmount: 0,
	updateAvgMonthlySpendAmount: (value: number) =>
		set(() => ({ avgMonthlySpendAmount: value })),
}));
