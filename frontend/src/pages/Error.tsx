
export const Error = () => {
	return (
		<div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
			<div className="flex items-center space-x-4 divide-x divide-muted">
				<div className="font-mono text-xl text-muted-foreground pr-4">
					404
				</div>
				<div className="pl-4 text-2xl font-semibold">
					Page does not exist!
				</div>
			</div>
		</div>
	);
};
