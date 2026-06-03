import {
	Box,
	Button,
	Divider,
	FormControlLabel,
	Switch,
	Typography,
} from "@mui/material";
import { handleError } from "../utils/errors";
import { dbActions } from "../utils/indexedDb";
import { useThemeMode } from "../hooks/ThemeProvider";
import { useDialogModal } from "../features/modal/DialogModal";
import TutorialButton, {
	TUTORIAL_SECTIONS,
} from "../features/tutorial/TutorialButton";

const Account: React.FC = () => {
	const { mode, toggleTheme } = useThemeMode();
	const { openDialog } = useDialogModal();

	const handleResetDemoData = async () => {
		try {
			await dbActions.resetDemoData();
			window.location.assign("/");
		} catch (e) {
			handleError(`Error resetting demo data. Error: ${e}`);
		}
	};

	const handleClearExisting = async () => {
		try {
			await dbActions.clearExistingData();
			window.location.assign("/");
		} catch (e) {
			handleError(`Error clearing data. Error: ${e}`);
		}
	};

	const handleClickClearExisting = () => {
		openDialog({
			title: "Clear Existing Data",
			onConfirm: () => handleClearExisting(),
			message:
				"This will permanently delete all habits, tasks and habit history. This is irreversible.",
			confirmDef: true,
		});
	};

	const handleClickResetDemoData = () => {
		openDialog({
			title: "Reset Demo Data",
			onConfirm: () => handleResetDemoData(),
			message:
				"This will replace all current data with the default demo data. This is irreversible.",
			confirmDef: true,
		});
	};

	return (
		<Box className="flex-center col gap2 full-h">
			<Typography variant="h5">Account Settings</Typography>
			<Divider />
			<FormControlLabel
				control={<Switch checked={mode === "light"} />}
				label={"Toggle Theme"}
				onClick={(e) => toggleTheme()}
			/>
			<TutorialButton
				section={TUTORIAL_SECTIONS.overview}
				text="View Tutorial"
			/>
			<br />
			<Button onClick={() => handleClickResetDemoData()}>
				Reset Demo Data
			</Button>
			<Button onClick={() => handleClickClearExisting()}>
				Clear Existing Data
			</Button>
		</Box>
	);
};

export default Account;
