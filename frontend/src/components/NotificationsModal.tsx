import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

interface Props {
	onClose: () => void;
	isOpen: boolean;
}

export const NotificationsModal = ({ onClose, isOpen }: Props) => {
	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Notifications</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-8 text-center">
					<p className="text-sm text-muted-foreground">No notifications yet.</p>
				</div>
			</DialogContent>
		</Dialog>
	);
};
