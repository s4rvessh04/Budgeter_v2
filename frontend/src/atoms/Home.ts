import { atom } from "jotai";

export const balanceAmountAtom = atom<number>(0);
export const expenseAmountAtom = atom<number>(0);
export const avgSavingsAmountAtom = atom<number>(0);

export const settleExpensesAmountAtom = atom<number>(0);
export const oweExpensesAmountAtom = atom<number>(0);
