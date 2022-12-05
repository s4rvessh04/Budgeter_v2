export interface IBaseExpense {
	id: string;
	userId: string;
	description: string;
	dateTime: string;
	lastUpdateTime: string;
	amount: number;
	isShared: boolean;
}

export interface ISharedExpense {
	id: string;
	expenseId: string;
	lastUpdateTime: string;
	mainUserId: string;
	sharedUserId: string;
	sharedUserAmount: number;
	status: "paid" | "unpaid";
}

export interface IExpense extends IBaseExpense {
	sharedExpenses: ISharedExpense[];
}
