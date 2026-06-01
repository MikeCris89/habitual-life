import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
} from "@mui/material";
import { createContext, useContext, useState } from "react";

interface DialogProps {
	open: boolean;
	onCancel: () => void;
	onConfirm?: () => void;
	title?: string;
	content?: React.ReactNode;
	message?: string;
	confirmMsg?: string;
	confirmDef?: boolean;
}

const DialogContext = createContext<any>(null);

export const DialogModal = ({
	open,
	onCancel,
	onConfirm,
	title,
	content,
	message,
	confirmMsg,
	confirmDef,
}: DialogProps) => {
	return (
		<Dialog className="flex-center col gap2" open={open}>
			{title && <DialogTitle>{title}</DialogTitle>}
			<DialogContent
				className="flex-center col gap2"
				sx={{ "& > *": { width: "100%" } }}
			>
				{content && content}
				{message && <Typography>{message}</Typography>}
				{confirmMsg && <Typography>{confirmMsg}</Typography>}
				{confirmDef && (
					<Typography sx={{ p: "10px 0" }}>Do you wish to continue?</Typography>
				)}
			</DialogContent>
			<DialogActions>
				<Button autoFocus onClick={() => onCancel()}>
					{onConfirm ? "Cancel" : "Close"}
				</Button>
				{onConfirm && <Button onClick={() => onConfirm()}>Confirm</Button>}
			</DialogActions>
		</Dialog>
	);
};

interface DialogOptions {
	content: React.ReactNode;
	onConfirm: () => void;
	title?: string;
	message?: string;
	confirmMsg?: string;
	confirmDef?: boolean;
}

export const DialogProvider = ({ children }: { children: React.ReactNode }) => {
	const [open, setOpen] = useState(false);
	const [opts, setOpts] = useState<DialogOptions>();

	const openDialog = (opts: DialogOptions) => {
		setOpts({ ...opts });
		setOpen(true);
	};

	const onCancel = () => {
		setOpen(false);
	};

	const onConfirmation = () => {
		if (opts?.onConfirm) {
			opts.onConfirm();
			setOpen(false);
		}
		return undefined;
	};

	const value = {
		openDialog,
	};
	if (open && !opts) {
		onCancel();
		return null;
	}

	return (
		<DialogContext.Provider value={value}>
			{children}
			<DialogModal
				open={open}
				onCancel={onCancel}
				onConfirm={onConfirmation}
				message={opts?.message}
				confirmMsg={opts?.confirmMsg}
				confirmDef={opts?.confirmDef}
				content={opts?.content}
				title={opts?.title}
			/>
		</DialogContext.Provider>
	);
};

export const useDialogModal = () => useContext(DialogContext);
