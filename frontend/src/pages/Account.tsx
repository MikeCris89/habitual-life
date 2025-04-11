import { Box, Button, Typography } from "@mui/material";
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

const Account: React.FC = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [createTestData, { isLoading }] = useCreateTestTaskDataMutation();
	//const [fetchHabits, { isFetching: loadingHabits }] = useLazyGetHabitsQuery();
	const [deleteTasks, { isLoading: loadingDeleteTasks }] =
		useDeleteTasksMutation();
	const { data: habits } = useGetHabitsQuery();
	const { data: pastTasks, isLoading: loadingPastTasks } =
		useGetTasksByRangeQuery();
	const { data: metaData } = useGetMetaQuery();
	const [setLastCreatedDate] = useSetLastCreatedDateMutation();

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

	if (isLoading) return <Loading />;

	return (
		<Box className="flex-center col gap2">
			<Typography variant="h5">Account Settings</Typography>
			<Button
				onClick={handleTestData}
				loading={loadingDeleteTasks || loadingPastTasks}
			>
				Add Test Tasks
			</Button>

			<Button
				onClick={() => handleDeleteData("tasks")}
				loading={loadingDeleteTasks || loadingPastTasks}
			>
				Delete All Tasks
			</Button>
		</Box>
	);
};

export default Account;
