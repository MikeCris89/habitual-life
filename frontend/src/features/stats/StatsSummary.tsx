import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectCurrentStats, selectStats } from "./statsSelectors";
import ProgressBar from "../../components/ProgressBar";
import { SectionContainer } from "../habits/HabitForm";
import { useNavigate } from "react-router-dom";

const StatsSummary = () => {
	const pastStats = useSelector(selectStats);
	const navigate = useNavigate();

	const { completionRate } = useSelector(selectCurrentStats);

	return (
		<Box
			className="flex-center col"
			sx={{ width: "min(400px, 90%)", cursor: "pointer" }}
			onClick={() => navigate("stats")}
		>
			<SectionContainer fullWidth>
				{pastStats && (
					<Box
						className="flex-between gap2"
						sx={{ width: "100%", alignItems: "center" }}
					>
						<Typography
							variant="subtitle2"
							color="primary.main"
							sx={{ whiteSpace: "nowrap" }}
						>
							Completion Rate
						</Typography>
						<ProgressBar completionRate={completionRate} large={true} />
						<Typography variant="body1" sx={{ fontWeight: "bold" }}>
							{completionRate}%
						</Typography>
					</Box>
				)}
			</SectionContainer>
		</Box>
	);
};

export default StatsSummary;
