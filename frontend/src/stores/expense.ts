import create from "zustand";

interface ExpenseState {
	sumExpensesAmount: number;
	updateSumExpensesAmount: (value: number) => void;
}

interface OweExpenseState {
	sumOweExpensesAmount: number;
	updateSumOweExpensesAmount: (value: number) => void;
	addSumOweExpensesAmount: (value: number) => void;
	resetSumOweExpensesAmount: () => void;
}

interface SettleExpenseState {
	sumSettleExpensesAmount: number;
	updateSumSettleExpensesAmount: (value: number) => void;
	addSumSettleExpensesAmount: (value: number) => void;
	resetSumSettleExpensesAmount: () => void;
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
	addSumOweExpensesAmount: (value: number) =>
		set((state) => ({
			sumOweExpensesAmount: state.sumOweExpensesAmount + value,
		})),
	updateSumOweExpensesAmount: (value: number) =>
		set(() => ({ sumOweExpensesAmount: value })),
	resetSumOweExpensesAmount: () => set(() => ({ sumOweExpensesAmount: 0 })),
}));

export const useSettleExpenseStore = create<SettleExpenseState>()((set) => ({
	sumSettleExpensesAmount: 0,
	addSumSettleExpensesAmount: (value: number) =>
		set((state) => ({
			sumSettleExpensesAmount: state.sumSettleExpensesAmount + value,
		})),
	updateSumSettleExpensesAmount: (value: number) =>
		set(() => ({ sumSettleExpensesAmount: value })),
	resetSumSettleExpensesAmount: () =>
		set(() => ({ sumSettleExpensesAmount: 0 })),
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
