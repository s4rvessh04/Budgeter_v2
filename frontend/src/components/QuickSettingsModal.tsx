import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

interface Props {
	onClose: () => void;
	isOpen: boolean;
}

export const QuickSettingsModal = ({ onClose, isOpen }: Props) => {
	const { toast } = useToast();

	const handleApply = () => {
		toast({
			title: "Saved successfully",
			variant: "default",
		});
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Quick Settings</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="space-y-4">
						<h4 className="font-medium leading-none">Expense Data</h4>
						<div className="grid grid-cols-4 items-center gap-4">
							<Label htmlFor="filter" className="text-right">
								Filter by:
							</Label>
							<Select defaultValue="option1">
								<SelectTrigger className="col-span-3" id="filter">
									<SelectValue placeholder="Select filter" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="option1">Current Month</SelectItem>
									<SelectItem value="option2">All Time</SelectItem>
									<SelectItem value="option3">Select Date</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</div>
				<DialogFooter>
					<Button onClick={handleApply}>Apply</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
