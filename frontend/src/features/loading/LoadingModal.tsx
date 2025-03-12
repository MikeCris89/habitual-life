import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { resetLoading } from "./loadingSlice";
import { useEffect } from "react";

const LoadingModal = () => {
	const { isLoading, status, message } = useSelector(
		(state: RootState) => state.loading
	);
	const dispatch = useDispatch();

	useEffect(() => {
		if (status === "success" || status === "error") {
			setTimeout(() => {
				dispatch(resetLoading());
			}, 750);
		}
	}, [status, dispatch]);

	return (
		<Modal
			open={isLoading || status !== "idle"}
			onClose={() => dispatch(resetLoading())}
		>
			<Box
				sx={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					backgroundColor: "rgba(0, 0, 0, 0.5)",
				}}
			>
				<Box
					sx={{
						backgroundColor: "white",
						padding: 3,
						borderRadius: 2,
						textAlign: "center",
					}}
				>
					{isLoading ? (
						<>
							<CircularProgress />
							<Typography variant="h6">Processing...</Typography>
						</>
					) : status === "success" ? (
						<>
							<Typography variant="h6" color="green">
								✅ Success
							</Typography>
						</>
					) : (
						<>
							<Typography variant="h6" color="red">
								❌ {message}
							</Typography>
						</>
					)}
				</Box>
			</Box>
		</Modal>
	);
};

export default LoadingModal;
