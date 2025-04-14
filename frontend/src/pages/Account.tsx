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
import {
	useGetHabitsQuery,
	useLazyGetHabitsQuery,
} from "../features/habits/habitsApi";
import { handleError } from "../utils/errors";
import { dayBefore, startOfDay, statsStartDate } from "../utils/timeUtils";
import Loading from "../components/Loading";
import { dbActions } from "../utils/indexedDb";
import { Task } from "../utils/types";
import { useDispatch } from "react-redux";
import { resetPastStats } from "../features/stats/statsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import {
	useGetMetaQuery,
	useSetLastCreatedDateMutation,
} from "../features/meta/metaApi";
import { useThemeMode } from "../hooks/ThemeProvider";
import { useDialogModal } from "../features/modal/DialogModal";

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

	const handleTestData = async () => {
		try {
			if (habits && habits.length > 0) {
				await deleteTasks(pastTasks?.dataArray ?? []);
				dispatch(resetPastStats());
				await createTestData({
					habits,
					completionRate: 70,
					startDate: statsStartDate(),
					endDate: startOfDay(),
				});
			} else {
			}
		} catch (e) {
			handleError("Error creating test data.");
		}
	};

	const handleDeleteData = async (storeName: string) => {
		try {
			await dbActions.batchDeleteAllTasks(storeName);
			navigate(0);
		} catch (e) {
			//	handleError(`Error batch deleting all ${storeName}. Error: ${e}`);
		}
	};

	const handleClickTestData = () => {
		openDialog({
			title: "Add Test Data",
			onConfirm: handleTestData,
			message:
				"This action will override all habit history. This option is for testing purposes only",
			confirmDef: true,
		});
	};
	const handleClickDeleteData = (storeName: string) => {
		openDialog({
			title: "Delete All Tasks",
			onConfirm: () => handleDeleteData(storeName),
			message:
				"This will permanently delete all tasks and habit history. This is irreversible.",
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
			<Button
				onClick={handleClickTestData}
				loading={loadingDeleteTasks || loadingPastTasks}
			>
				Add Test Tasks
			</Button>

			<Button
				onClick={() => handleClickDeleteData("tasks")}
				loading={loadingDeleteTasks || loadingPastTasks}
			>
				Delete All Tasks
			</Button>
		</Box>
	);
};

export default Account;
