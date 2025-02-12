import { Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { handleError } from "../utils/errors";
import { useEffect, useState } from "react";

type ErrorProps = {
	error: Error;
	resetErrorBoundary: () => void;
};

const ErrorFallback: React.FC<ErrorProps> = ({ error, resetErrorBoundary }) => {
	const navigate = useNavigate();
	const [logged, setLogged] = useState<Boolean>(false);

	useEffect(() => {
		if (!logged) {
			if (
				typeof error === "object" &&
				"message" in error &&
				error.message === "handleErrorThrow"
			) {
			} else {
				handleError(error, false);
				setLogged(true);
			}
		}
	}, [error, logged]);

	const handleReset = () => {
		resetErrorBoundary();
		navigate("/", { replace: true });
	};
	return (
		<div role="alert">
			<Typography variant="h4">
				An error has occurred. Please refresh the application.
			</Typography>
			<Button onClick={handleReset}>Refresh</Button>
		</div>
	);
};

export default ErrorFallback;
