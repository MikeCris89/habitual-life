import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { openModal } from "../features/modal/modalSlice";

const AddButton = () => {
	const dispatch = useDispatch();

	return (
		<Button
			variant="contained"
			size="small"
			onClick={() => dispatch(openModal({ component: "addMenu" }))}
		>
			ADD
		</Button>
	);
};

export default AddButton;
