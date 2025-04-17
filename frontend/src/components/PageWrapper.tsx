import { Box, SxProps, Theme } from "@mui/material";

const PageWrapper = ({
	children,
	sx,
}: {
	children: React.ReactNode;
	sx?: SxProps<Theme>;
}) => {
	return (
		<Box
			className="flex-center col gap3 full-w full-h"
			sx={{
				backgroundColor: "background.default",
				p: "2px 2px",
				justifyContent: "flex-start",
				...sx,
			}}
		>
			{children}
		</Box>
	);
};

export default PageWrapper;
