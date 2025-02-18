import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Box } from "@mui/material";
import useDisplay from "../hooks/useDisplay";
import DataLoader from "../components/DataLoader";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

const Root = () => {
	const { isMobile } = useDisplay();

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: isMobile ? "column-reverse" : "column",
				width: "100%",
				height: "100%",
				overflow: "hidden",
			}}
		>
			<NavBar isMobile={isMobile} />

			<Box
				sx={{
					width: "100%",
					height: "100%",
					//p: 1,
					overflow: "hidden",
					flex: 1,
				}}
			>
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					<DataLoader>
						<Outlet />
					</DataLoader>
				</ErrorBoundary>
			</Box>
		</Box>
	);
};

export default Root;
