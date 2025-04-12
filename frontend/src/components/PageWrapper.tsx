import { Box } from "@mui/material";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<Box
			className="full-w full-h"
			sx={{ backgroundColor: "background.default" }}
		>
			{children}
		</Box>
	);
};

export default PageWrapper;
