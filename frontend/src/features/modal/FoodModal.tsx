import { Box, Modal, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useThemeMode } from "../../hooks/ThemeProvider";

interface Props {
	children: React.ReactNode;
}

const FoodModal = ({ children }: Props) => {
	const navigate = useNavigate();
	const { isLight } = useThemeMode();
	const onClose = () => navigate(-1);

	return (
		<Modal
			className="flex-center fullwidth"
			sx={{
				maxWidth: "600px",
				maxHeight: "100%",
				minHeight: 0,
				p: 2,
				margin: "auto",
			}}
			onClose={onClose}
			open
		>
			<Box
				className="flex-center col gap2 full-w full-h"
				sx={{
					p: 1,
					overflow: "auto",
					bgcolor: "background.default",
					borderRadius: "12px",
					boxShadow: isLight
						? "0px 4px 20px rgba(0, 0, 0, 0.4)" // light mode → soft black shadow
						: "0px 4px 20px rgba(255, 255, 255, 0.4)", // dark mode → subtle white glow
				}}
			>
				{children}
			</Box>
		</Modal>
	);
};

export default FoodModal;
