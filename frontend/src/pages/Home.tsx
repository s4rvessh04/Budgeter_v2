import { ExpenseTable, TopCards, Navbar } from "../components";
import { ExpenseList } from "../components/ExpenseList";

export const Home = () => {
	return (
		<Navbar>
			<div className="container mx-auto flex min-h-full flex-col max-w-7xl">
				<TopCards />
				<div className="grid grid-cols-1 lg:grid-cols-6 gap-5 h-full">
					<div className="col-span-1 lg:col-span-4 rounded-lg border bg-card shadow-sm overflow-hidden h-full flex flex-col">
						<div className="flex-1 overflow-y-auto">
							<ExpenseTable />
						</div>
					</div>
					<div className="col-span-1 lg:col-span-2 rounded-lg border bg-card shadow-sm overflow-hidden h-full flex flex-col">
						<ExpenseList />
					</div>
				</div>
			</div>
		</Navbar>
	);
};
