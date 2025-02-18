import { Button, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { handleError, logError } from "../utils/errors";
import { useEffect, useRef, useState } from "react";

interface ErrorProps {
	error: Error;
	resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorProps) => {
	const navigate = useNavigate();
	const [logged, setLogged] = useState<Boolean>(false);
	const location = useLocation();
	const isFirstRender = useRef(true);

	// dont log the error if coming from handleError. handleError will do error log.
	useEffect(() => {
		if (!logged) {
			if (
				typeof error === "object" &&
				"message" in error &&
				error.message === "handleErrorThrow"
			) {
			} else {
				logError(error);
				setLogged(true);
			}
		}
	}, [error, logged]);

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		resetErrorBoundary();
	}, [location.pathname, resetErrorBoundary, isFirstRender]);

	const handleReset = () => {
		resetErrorBoundary();
		navigate(location.pathname, { replace: true });
	};
	return (
		<div
			role="alert"
			style={{ height: "100%", width: "100%", textAlign: "center" }}
			className="flex-center col gap2"
		>
			<Typography variant="h6">
				An error has occurred. <br />
				Please refresh the application.
			</Typography>
			<Button variant="outlined" onClick={handleReset}>
				Refresh
			</Button>
		</div>
	);
};

export default ErrorFallback;
