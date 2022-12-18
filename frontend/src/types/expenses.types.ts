export interface IBaseExpense {
	id: string;
	user_id: string;
	description: string;
	date_time: string;
	last_update: string;
	amount: number;
	is_shared: boolean;
}

export interface ISharedExpense {
	id: string;
	expense_id: string;
	last_update: string;
	main_user_id: string;
	shared_user_id: string;
	shared_user_amount: number;
	status: "P" | "UP";
}

export interface IExpense extends IBaseExpense {
	shared_expenses: ISharedExpense[];
}
