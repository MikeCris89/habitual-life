import { Box, LinearProgress } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentGoal } from "../features/stats/statsSelectors";

interface Props {
	completionRate: number;
	large?: boolean;
}

const ProgressBar = ({ completionRate, large = false }: Props) => {
	const goal = useSelector(selectCurrentGoal);
	return (
		<Box sx={{ width: "100%", padding: "2px" }}>
			<LinearProgress
				variant="determinate"
				value={completionRate}
				sx={{
					height: large ? 8 : 4,
					borderRadius: 5,
					backgroundColor: "#ddd",
					"& .MuiLinearProgress-bar": {
						backgroundColor:
							completionRate > goal + 5
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
	);
};

export default ProgressBar;
