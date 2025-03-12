import { Box, Button, Typography } from "@mui/material";
import { GoodTask, isSingleTimer } from "../../utils/types";
import { handleError } from "../../utils/errors";
import { Check } from "@mui/icons-material";
import magicSound from "../../assets/sounds/message-ringtone-magic.mp3";
import { useCheckOffTaskMutation } from "../tasks/tasksApi";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../modal/modalSlice";
import TimerBase from "./TimerBase";
import { selectTimer } from "./timerSelectors";
import { useEffect, useMemo } from "react";

interface Props {
	task: GoodTask;
}

const SingleTimer = ({ task }: Props) => {
	const { timer, ...timerState } = useSelector(selectTimer);
	const { isComplete } = timerState;
	const dispatch = useDispatch();
	const [checkoffTask] = useCheckOffTaskMutation();
	const sound = useMemo(() => new Audio(magicSound), []);

	if (timer && !isSingleTimer(timer))
		handleError("Non single timer sent to SingleTimer component.");

	useEffect(() => {
		if (isComplete) {
			sound.play();
		}
	}, [isComplete, sound]);

	return (
		<Box className="flex-center col gap2" sx={{ width: "100%" }}>
			<Typography variant="h6">{task.title}</Typography>

			<TimerBase />

			{isComplete && (
				<Button
					variant="contained"
					onClick={() => {
						checkoffTask(task);
						dispatch(closeModal());
					}}
					className="flex-between gap2"
				>
					Done
					<Check fontSize="small" />
				</Button>
			)}
		</Box>
	);
};

export default SingleTimer;
