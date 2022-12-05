export interface IExpenseItem {
	id: string;
	dateTime: string;
	description: string;
	amount: number;
}

export interface IExpenseList {
	id: string;
	name: string;
	totalAmount: number;
	expenses: IExpenseItem[];
}
