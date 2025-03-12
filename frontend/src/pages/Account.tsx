import { Box, Button, Typography } from "@mui/material";
import {
	useCreateTestTaskDataMutation,
	useDeleteTasksMutation,
	useGetTasksByRangeQuery,
} from "../features/tasks/tasksApi";
import { useLazyGetHabitsQuery } from "../features/habits/habitsApi";
import { handleError } from "../utils/errors";
import { startOfDay, statsStartDate } from "../utils/timeUtils";
import Loading from "../components/Loading";
import { dbActions } from "../utils/indexedDb";
import { Task } from "../utils/types";
import { useDispatch } from "react-redux";
import { resetPastStats } from "../features/stats/statsSlice";

const Account: React.FC = () => {
	const dispatch = useDispatch();
	const [createTestData, { isLoading }] = useCreateTestTaskDataMutation();
	const [fetchHabits, { isFetching: loadingHabits }] = useLazyGetHabitsQuery();
	const [deleteTasks, { isLoading: loadingDeleteTasks }] =
		useDeleteTasksMutation();
	const { data: pastTasks, isLoading: loadingPastTasks } =
		useGetTasksByRangeQuery();

	const handleTestData = async () => {
		try {
			const habits = await fetchHabits(undefined, true).unwrap();
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

	if (isLoading || loadingHabits) return <Loading />;

	return (
		<Box className="flex-center col gap2">
			<Typography variant="h5">Account Settings</Typography>
			<Button
				onClick={handleTestData}
				loading={loadingDeleteTasks || loadingHabits || loadingPastTasks}
			>
				Add Test Tasks
			</Button>
		</Box>
	);
};

export default Account;
