import { Box } from "@mui/material";

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
	return (
		<Box
			className="full-w full-h"
			sx={{ backgroundColor: "background.default", p: "2px 2px" }}
		>
			{children}
		</Box>
	);
};

export default PageWrapper;
