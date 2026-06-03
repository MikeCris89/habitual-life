import {
	Box,
	Button,
	Divider,
	FormControl,
	FormControlLabel,
	Switch,
	Typography,
} from "@mui/material";
import {
	useCreateTestTaskDataMutation,
	useDeleteTasksMutation,
	useGetTasksByRangeQuery,
} from "../features/tasks/tasksApi";
import { useGetHabitsQuery } from "../features/habits/habitsApi";
import { handleError } from "../utils/errors";
import { startOfDay, statsStartDate } from "../utils/timeUtils";
import Loading from "../components/Loading";
import { dbActions } from "../utils/indexedDb";
import { useDispatch } from "react-redux";
import { resetPastStats } from "../features/stats/statsSlice";
import { useNavigate } from "react-router-dom";

import { useThemeMode } from "../hooks/ThemeProvider";
import { useDialogModal } from "../features/modal/DialogModal";
import TutorialButton, {
	TUTORIAL_SECTIONS,
} from "../features/tutorial/TutorialButton";

const Account: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { mode, toggleTheme } = useThemeMode();
	const { openDialog } = useDialogModal();

	const [createTestData, { isLoading }] = useCreateTestTaskDataMutation();
	const [deleteTasks, { isLoading: loadingDeleteTasks }] =
		useDeleteTasksMutation();
	const { data: habits } = useGetHabitsQuery();
	const { data: pastTasks, isLoading: loadingPastTasks } =
		useGetTasksByRangeQuery();

	// const handleTestData = async () => {
	// 	try {
	// 		if (habits && habits.length > 0) {
	// 			await deleteTasks(pastTasks?.dataArray ?? []);
	// 			dispatch(resetPastStats());
	// 			await createTestData({
	// 				habits,
	// 				completionRate: 70,
	// 				startDate: statsStartDate(),
	// 				endDate: startOfDay(),
	// 			});
	// 		} else {
	// 		}
	// 	} catch (e) {
	// 		handleError("Error creating test data.");
	// 	}
	// };

	// const handleClickTestData = () => {
	// 	openDialog({
	// 		title: "Add Test Data",
	// 		onConfirm: handleTestData,
	// 		message:
	// 			"This action will override all habit history. This option is for testing purposes only",
	// 		confirmDef: true,
	// 	});
	// };

	// const handleDeleteAllData = async () => {
	// 	try {
	// 		await dbActions.deleteAllData();
	// 		navigate(0); // reload app, meta will reinitialize fresh
	// 	} catch (e) {
	// 		handleError(`Error deleting all data. Error: ${e}`);
	// 	}
	// };

	// const handleClickDeleteAllData = () => {
	// 	openDialog({
	// 		title: "Delete All Data",
	// 		onConfirm: handleDeleteAllData,
	// 		message:
	// 			"This will permanently delete ALL data including habits, history, meals and ingredients. This is irreversible.",
	// 		confirmDef: true,
	// 	});
	// };

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

	if (isLoading) return <Loading />;

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
			{/* <Button
				onClick={handleClickTestData}
				loading={loadingDeleteTasks || loadingPastTasks}
			>
				Add Test Data
			</Button> */}
			<Button
				onClick={() => handleClickResetDemoData()}
				loading={loadingDeleteTasks || loadingPastTasks}
			>
				Reset Demo Data
			</Button>
			<Button
				onClick={() => handleClickClearExisting()}
				loading={loadingDeleteTasks || loadingPastTasks}
			>
				Clear Existing Data
			</Button>
		</Box>
	);
};

export default Account;
