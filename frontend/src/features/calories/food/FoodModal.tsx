import { Modal, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface Props {
	children: React.ReactNode;
}

const FoodModal = ({ children }: Props) => {
	const navigate = useNavigate();

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
			<Paper
				className="flex-center col gap2 full-w full-h"
				sx={{
					p: 1,
					overflow: "auto",
				}}
			>
				{children}
			</Paper>
		</Modal>
	);
};

export default FoodModal;
