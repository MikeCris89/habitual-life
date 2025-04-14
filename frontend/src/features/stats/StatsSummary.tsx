import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentStats } from "./statsSelectors";
import { RootState } from "../../app/store";
import ProgressBar from "../../components/ProgressBar";
import { SectionContainer } from "../habits/HabitForm";

const StatsSummary = () => {
	const pastStats = useSelector((state: RootState) => state.stats);

	const { completionRate } = useSelector(selectCurrentStats);

	console.log("StatsSummary Rendering ", pastStats);

	return (
		<Box className="flex-center col" sx={{ width: "90%" }}>
			<SectionContainer fullWidth>
				{pastStats && (
					<Box className="flex-center col" sx={{ width: "100%" }}>
						<Typography variant="subtitle2" color="primary.main">
							Completion Rate
						</Typography>
						<Box className="flex-between gap2" sx={{ width: "80%" }}>
							<ProgressBar completionRate={completionRate} large={true} />
							<Typography variant="body1" sx={{ fontWeight: "bold" }}>
								{completionRate}%
							</Typography>
						</Box>
					</Box>
				)}
			</SectionContainer>
		</Box>
	);
};

export default StatsSummary;
