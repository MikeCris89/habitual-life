import { Box, IconButton, Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "./modalSlice";
import { RootState } from "../../app/store";
import { CloseOutlined } from "@mui/icons-material";
import SingleTimer from "../timer/SingleTimer";
import RoundTimer from "../timer/RoundTimer";
import AddMenu from "../../components/AddMenu";
import IngredientLog from "../calories/IngredientLog";
import MealLog from "../calories/MealLog";

const MODAL_COMPONENTS: Record<string, React.FC<any>> = {
	singleTimer: SingleTimer,
	roundTimer: RoundTimer,
	addMenu: AddMenu,
	ingredientLog: IngredientLog,
	mealLog: MealLog,
};

const GlobalModal = () => {
	const dispatch = useDispatch();
	const { isOpen, component, props, title } = useSelector(
		(state: RootState) => state.modal
	);
	const ModalComponent = component ? MODAL_COMPONENTS[component] : null;

	const handleClose = (event: React.MouseEvent, reason?: string) => {
		// Prevent closing on backdrop click
		if (reason === "backdropClick") return;
		dispatch(closeModal());
	};

	return (
		<Modal open={isOpen} onClose={handleClose}>
			<Box
				sx={{
					position: "absolute",
					top: "50%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					bgcolor: "background.paper",
					boxShadow: 24,
					p: 1,
					borderRadius: 2,
					minHeight: "200px",
					minWidth: "250px",
				}}
				//onClick={(e) => e.stopPropagation()}
			>
				<Box className="flex-between" sx={{ width: "100%" }}>
					<Typography variant="h6">{title}</Typography>
					<IconButton onClick={handleClose}>
						<CloseOutlined />
					</IconButton>
				</Box>
				<Box sx={{ p: 4, paddingTop: "5px" }}>
					{ModalComponent && <ModalComponent {...props} />}
				</Box>
			</Box>
		</Modal>
	);
};

export default GlobalModal;
