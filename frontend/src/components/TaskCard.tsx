import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	Paper,
	Typography,
} from "@mui/material";
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

interface CardProps {
	task: Task;
	goal: number;
	pastTasks: Task[];
	circleIcon?: boolean;
}

const TaskCard = ({ task, goal, pastTasks, circleIcon = false }: CardProps) => {
	const [checkOffTask] = useCheckOffTaskMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const totalTasks = pastTasks.length + 1;
	const completeTasks = pastTasks.filter((task) => task.complete).length ?? 0;

	const completionRate =
		totalTasks > 0
			? Math.round(
					((completeTasks + (task.complete ? 1 : 0)) / totalTasks) * 100
			  )
			: 0;

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
			<Box sx={{ width: "100%", mr: 1 }}>
				<LinearProgress
					variant="determinate"
					value={completionRate}
					sx={{
						borderRadius: 5,
						backgroundColor: "#ddd",
						"& .MuiLinearProgress-bar": {
							backgroundColor:
								completionRate >= goal + 5
									? "primary.main"
									: completionRate >= goal - 5
									? "green"
									: completionRate >= goal - 20
									? "orange"
									: "red",
						},
					}}
				/>
			</Box>
		</Paper>
	);
};

export default TaskCard;
