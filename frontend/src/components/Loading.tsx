import { Box, CircularProgress, Typography } from "@mui/material";

const Loading = () => {
	return (
		<Box className="flex-center full-w full-h" sx={{}}>
			<CircularProgress />
			<Typography variant="body1" sx={{ ml: 2 }}>
				Loading...
			</Typography>
		</Box>
	);
};

export default Loading;
