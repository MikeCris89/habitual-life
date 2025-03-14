import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import PageNav from "../../components/PageNav";
import { useState } from "react";
import { numberString, stringToNum } from "../../utils/helpers";
import {
	useGetDailyTasksQuery,
	useIncrementCounterMutation,
} from "../tasks/tasksApi";
import { isCounterTask, PresetId } from "../../utils/types";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSuccess } from "../loading/loadingSlice";
import { handleError } from "../../utils/errors";
import Loading from "../../components/Loading";
import NumberInput from "../../components/NumberInput";

const CalorieLog = () => {
	const [incrementTask] = useIncrementCounterMutation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const { data: task, isLoading } = useGetDailyTasksQuery(undefined, {
		selectFromResult: ({ data = [], isLoading }) => {
			const result = data.find((el) => el.habitId === PresetId.calorieCounter);
			return { data: result, isLoading };
		},
	});
	const [calories, setCalories] = useState<number>(0);

	if (isLoading) return <Loading />;

	if (task && !isCounterTask(task)) {
		handleError("Calorie task is not counter.");
	}

	const handleSubmit = () => {
		if (task && calories) {
			incrementTask({ task, value: calories });
		}
		dispatch(setSuccess());
		setTimeout(() => navigate(-1), 750);
	};

	return (
		<Box
			className="flex-between col gap2"
			sx={{ p: 1, height: "100%", "& >*": { width: "100%" } }}
		>
			<PageNav back={true} title="Log Calories" />
			<Paper className="flex-center gap2" sx={{ p: 2, alignItems: "end" }}>
				<Typography variant="h3">{task?.count}</Typography>
				<Typography variant="h6">/{task?.total}</Typography>
			</Paper>
			<Paper sx={{ p: 1 }}>
				<NumberInput
					label="Calories"
					value={calories}
					onChange={(value) => setCalories(value)}
					fullWidth={false}
					sx={{ float: "right" }}
					maxLength={4}
				/>
			</Paper>
			<Button variant="contained" onClick={handleSubmit}>
				Submit
			</Button>
		</Box>
	);
};

export default CalorieLog;
