import { Box, IconButton, Typography } from "@mui/material";
import { formatSecondsTime } from "../../utils/timeUtils";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { Pause, PlayArrow, Replay } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { selectTimer } from "./timerSelectors";
import { onComplete, restartTimer, startTimer } from "./timerSlice";
import { isNoneTimer } from "../../utils/types";

const TimerBase = () => {
	const dispatch = useDispatch();
	const { timer, ...timerState } = useSelector(selectTimer);

	if (isNoneTimer(timer)) {
		return <Box>No Timer Selected</Box>;
	}

	const { isPlaying, key, duration, isBreak } = timerState;

	// Center of Timer
	const renderTime = ({
		remainingTime,
	}: {
		remainingTime: number;
	}): React.ReactNode => {
		const time = formatSecondsTime(remainingTime);

		return (
			<Box>
				{isBreak ? (
					<Typography variant="h4">Break</Typography>
				) : (
					<Typography variant="h4">{time}</Typography>
				)}
			</Box>
		);
	};

	return (
		<Box>
			<IconButton onClick={() => dispatch(startTimer())}>
				<CountdownCircleTimer
					key={key}
					isPlaying={isPlaying}
					duration={duration}
					onComplete={() => {
						dispatch(onComplete());
					}}
					//initialRemainingTime={initRemainingTime}
					colors={
						isBreak ? ["#1E90FF", "#4CAF50"] : ["#4CAF50", "#FFC107", "#FF5733"]
					}
					colorsTime={isBreak ? [duration, 0] : [duration, duration / 2, 0]} // Blue -> Green /  Green -> Yellow -> Red
				>
					{renderTime}
				</CountdownCircleTimer>
			</IconButton>
			<Box className="flex-center gap2">
				<IconButton onClick={() => dispatch(restartTimer())}>
					<Replay fontSize="medium" />
				</IconButton>
				<IconButton onClick={() => dispatch(startTimer())}>
					{isPlaying ? (
						<Pause fontSize="large" />
					) : (
						<PlayArrow fontSize="large" />
					)}
				</IconButton>
			</Box>
		</Box>
	);
};

export default TimerBase;
