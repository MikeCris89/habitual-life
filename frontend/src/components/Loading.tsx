import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = () => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}
		>
			<CircularProgress />
			<Typography variant="body1" sx={{ ml: 2 }}>
				Loading...
			</Typography>
		</Box>
	);
};

export default Loading;
