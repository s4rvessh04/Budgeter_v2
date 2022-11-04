export function parseDate(dateString: string): { date: string; time: string } {
	const utcString: Date = new Date(dateString);
	return {
		date: utcString.toDateString(),
		time: utcString.toTimeString().slice(0, 5),
	};
}

export function parseAmount(amount?: string): string {
	amount!?.replace(/^\$/, "");
	return `₹` + amount;
}
