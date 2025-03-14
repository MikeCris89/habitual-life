import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import {
	isGoodTask,
	isNoneTimer,
	isRoundTimer,
	isSingleTimer,
	Task,
} from "../utils/types";
import {
	AvTimerTwoTone,
	Check,
	CheckCircleTwoTone,
	PinOutlined,
	TimerOutlined,
} from "@mui/icons-material";
import { useCheckOffTaskMutation } from "../features/tasks/tasksApi";
import { useDispatch } from "react-redux";
import { openModal } from "../features/modal/modalSlice";
import { formatMsTime } from "../utils/timeUtils";
import { setTimer } from "../features/timer/timerSlice";
import { useNavigate } from "react-router-dom";
import ProgressBar from "./ProgressBar";
import { getCompletionRate } from "../utils/helpers";

interface CardProps {
	task: Task;
	pastTasks: Task[];
	circleIcon?: boolean;
}

const TaskCard = ({ task, pastTasks, circleIcon = false }: CardProps) => {
	const [checkOffTask] = useCheckOffTaskMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const completionRate = getCompletionRate(pastTasks, task);

	return (
		<Paper className="flex-center col gap2" sx={{ p: 2, overflowX: "hidden" }}>
			<Box
				className="flex-between"
				sx={{ width: "100%", alignItems: "center" }}
			>
				<Box
					sx={{
						flex: "1 1 auto",
						flexWrap: "wrap",
						height: "100%",
						overflowWrap: "break-word",
						overflow: "hidden",
					}}
					onClick={() => navigate(`/${task.habitId}`)}
				>
					<Typography variant="body1">{task.title}</Typography>
				</Box>
				{isGoodTask(task) && !isNoneTimer(task.timer) && (
					<Box className="flex-center col">
						{isSingleTimer(task.timer) && (
							<IconButton
								onClick={() => {
									dispatch(setTimer(task.timer));
									dispatch(
										openModal({
											component: "singleTimer",
											props: { task },
										})
									);
								}}
							>
								<AvTimerTwoTone />
								<Typography variant="body2">
									{formatMsTime(task.timer.duration)}
								</Typography>
							</IconButton>
						)}
						{isRoundTimer(task.timer) && (
							<IconButton
								onClick={() => {
									dispatch(setTimer(task.timer));
									dispatch(
										openModal({
											component: "roundTimer",
											props: { task },
										})
									);
								}}
							>
								<TimerOutlined />
								<PinOutlined />
							</IconButton>
						)}
					</Box>
				)}
				{circleIcon ? (
					<Button
						size="small"
						variant={task.complete ? "contained" : "outlined"}
						onClick={() => {
							checkOffTask(task);
						}}
						sx={{
							borderRadius: "50%",
							padding: 0,
							minHeight: 40,
							minWidth: 40,
						}}
					>
						<Check />
					</Button>
				) : (
					<Button
						variant={task.complete ? "contained" : "outlined"}
						onClick={() => {
							checkOffTask(task);
						}}
					>
						<CheckCircleTwoTone />
					</Button>
				)}
			</Box>
			<ProgressBar completionRate={completionRate} />
		</Paper>
	);
};

export default TaskCard;
