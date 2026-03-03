import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import TutorialButton, {
	TUTORIAL_SECTIONS,
} from "../features/tutorial/TutorialButton";

interface PageProps {
	back?: boolean;
	title: string;
	tutorialSection?: keyof typeof TUTORIAL_SECTIONS;
}

const navStyle = {
	display: "grid",
	gridTemplateColumns: "1fr 2fr 1fr",
	alignItems: "center",
	justifyItems: "center",
	width: "100%",
	marginBottom: "5px",
	overflow: "hidden",
	minHeight: "30px",
	// bgcolor: "background.default",
};

const PageNav = ({ back = false, title = "", tutorialSection }: PageProps) => {
	const navigate = useNavigate();

	return (
		<Paper elevation={2} sx={navStyle}>
			<Box sx={{ justifySelf: "left" }}>
				{back && (
					<Button onClick={() => navigate(-1)} size="small">
						<ArrowBack fontSize="small" />
					</Button>
				)}
			</Box>
			<Typography variant="body2">{title}</Typography>
			{tutorialSection ? (
				<Box sx={{ justifySelf: "right", mr: 2 }}>
					<TutorialButton section={tutorialSection} />
				</Box>
			) : (
				<Box></Box>
			)}
		</Paper>
	);
};

export default PageNav;
