import {
	Box,
	Button,
	Card,
	IconButton,
	Paper,
	Typography,
} from "@mui/material";
import {
	isGoodTask,
	isNoneTimer,
	isRoundTimer,
	isSingleTimer,
	Task,
} from "../../utils/types";
import {
	AvTimerTwoTone,
	Check,
	CheckCircleTwoTone,
	PinOutlined,
	TimerOutlined,
} from "@mui/icons-material";
import { useCheckOffTaskMutation } from "./tasksApi";
import { useDispatch } from "react-redux";
import { openModal } from "../modal/modalSlice";
import { formatMsTime } from "../../utils/timeUtils";
import { setTimer } from "../timer/timerSlice";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../../components/ProgressBar";
import { getCompletionRate } from "../../utils/helpers";

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
		<Card
			elevation={3}
			className="flex-center col gap2"
			sx={{ p: 2, overflowX: "hidden" }}
		>
			<Box
				className="flex-between"
				sx={{ width: "100%", alignItems: "center" }}
			>
				<Typography
					variant="body1"
					sx={{
						flex: "1 1 auto",
						flexWrap: "wrap",
						height: "100%",
						overflowWrap: "break-word",
						overflow: "hidden",
						alignSelf: "center",
					}}
					onClick={() => navigate(`/${task.habitId}`)}
				>
					{/* <Typography variant="body1" sx={{ height: "100%" }}> */}
					{task.title}
					{/* </Typography> */}
				</Typography>
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
		</Card>
	);
};

export default TaskCard;
