interface IServerExpense {
	id: number;
	shared_expenses: ISharedExpense[];
	owner: {
		id: number;
		username: string;
		email: string;
		full_name: string;
	};
	create_dt: string;
	update_dt: string;
	description: string;
	amount: string;
}

interface IServerSharedExpense {
	id: number;
	loaner: {
		id: number;
		username: string;
		email: string;
		full_name: string;
	};
	expense: {
		id: number;
		description: string;
		owner: {
			id: number;
			username: string;
			email: string;
			full_name: string;
		};
	};
	create_dt: string;
	update_dt: string;
	status: "UP" | "P";
	amount: string;
}
