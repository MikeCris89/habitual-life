import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface PageProps {
	back?: boolean;
	title: string;
}

const navStyle = {
	display: "grid",
	gridTemplateColumns: "1fr 2fr 1fr",
	alignItems: "center",
	justifyItems: "center",
	width: "100%",
	marginBottom: "5px",
	overflow: "hidden",
	// bgcolor: "background.default",
};

const PageNav = ({ back = false, title = "" }: PageProps) => {
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
			<Box></Box>
		</Paper>
	);
};

export default PageNav;
