import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

type PageProps = {
	back?: boolean;
	title: string;
};

const navStyle = {
	display: "grid",
	gridTemplateColumns: "1fr 2fr 1fr",
	alignItems: "center",
	justifyItems: "center",
};

const PageNav: React.FC<PageProps> = ({ back = false, title = "" }) => {
	const navigate = useNavigate();

	return (
		<Box sx={navStyle}>
			<Box sx={{ justifySelf: "left" }}>
				{back && (
					<Button onClick={() => navigate(-1)} size="small">
						<ArrowBack fontSize="small" />
					</Button>
				)}
			</Box>
			<Typography variant="body2">{title}</Typography>
			<Box></Box>
		</Box>
	);
};

export default PageNav;
