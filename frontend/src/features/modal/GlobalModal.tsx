import {
	Box,
	IconButton,
	Modal,
	SxProps,
	Theme,
	Typography,
} from "@mui/material";
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
	// tutorial: undefined,
};

const GlobalModal = () => {
	const dispatch = useDispatch();
	const { isOpen, component, props, title, fullScreen } = useSelector(
		(state: RootState) => state.modal,
	);
	const ModalComponent = component ? MODAL_COMPONENTS[component] : null;

	const handleClose = (event: React.MouseEvent, reason?: string) => {
		// Prevent closing on backdrop click
		if (reason === "backdropClick") return;
		dispatch(closeModal());
	};

	const boxSx: SxProps<Theme> = fullScreen
		? {
				position: "absolute",
				top: 0,
				left: 0,
				width: "100%",
				height: "100%",
				bgcolor: "background.paper",
				overflow: "hidden",
			}
		: {
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
			};

	return (
		<Modal open={isOpen} onClose={handleClose}>
			<Box sx={{ ...boxSx }}>
				{!fullScreen && (
					<Box className="flex-between" sx={{ width: "100%" }}>
						<Typography variant="h6">{title}</Typography>
						<IconButton onClick={handleClose}>
							<CloseOutlined />
						</IconButton>
					</Box>
				)}
				<Box sx={fullScreen ? {} : { p: 4, paddingTop: "5px" }}>
					{ModalComponent && <ModalComponent {...props} />}
				</Box>
			</Box>
		</Modal>
	);
};

export default GlobalModal;
