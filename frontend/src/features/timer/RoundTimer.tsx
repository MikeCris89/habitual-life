import { Box, Button, Typography } from "@mui/material";
import { GoodTask, isRoundTimer } from "../../utils/types";
import { handleError } from "../../utils/errors";
import { useDispatch, useSelector } from "react-redux";
import { useCheckOffTaskMutation } from "../tasks/tasksApi";
import magicSound from "../../assets/sounds/message-ringtone-magic.mp3";
import TimerBase from "./TimerBase";
import { Check } from "@mui/icons-material";
import { closeModal } from "../modal/modalSlice";
import { selectTimer } from "./timerSelectors";
import { useEffect, useMemo } from "react";

interface Props {
	task: GoodTask;
}

const RoundTimer = ({ task }: Props) => {
	const { timer, ...timerState } = useSelector(selectTimer);
	const dispatch = useDispatch();
	const [checkoffTask] = useCheckOffTaskMutation();
	const sound = useMemo(() => new Audio(magicSound), []);

	if (timer && !isRoundTimer(timer)) {
		handleError("Non round timer passed to round timer component.");
	}

	const { isComplete } = timerState;

	useEffect(() => {
		if (isComplete) {
			sound.play();
		}
	}, [isComplete, sound]);

	return (
		<Box className="flex-center col gap2" sx={{ width: "100%" }}>
			<Typography variant="h6">{task.title}</Typography>
			<Typography variant="body2">
				Set: {timerState.currSet} / {timer.sets}
			</Typography>
			<Typography variant="body1">
				Round: {timerState.currRound} / {timer.rounds}
			</Typography>

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

export default RoundTimer;
