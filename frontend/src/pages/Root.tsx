import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Box } from "@mui/material";
import useDisplay from "../hooks/useDisplay";
import DataLoader from "../components/DataLoader";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";
import { Suspense } from "react";
import Loading from "../components/Loading";
import GlobalModal from "../features/modal/GlobalModal";
import PageWrapper from "../components/PageWrapper";

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
			<GlobalModal />
			<NavBar isMobile={isMobile} />

			<Box
				sx={{
					width: "100%",
					overflow: "hidden",
					flex: 1,
					minHeight: 0,
					"& >*": { width: "100%", minHeight: 0, height: "100%" },
				}}
			>
				<ErrorBoundary FallbackComponent={ErrorFallback}>
					<DataLoader>
						<Suspense fallback={<Loading />}>
							<PageWrapper>
								<Outlet />
							</PageWrapper>
						</Suspense>
					</DataLoader>
				</ErrorBoundary>
			</Box>
		</Box>
	);
};

export default Root;
