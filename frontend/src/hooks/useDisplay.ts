import { useMediaQuery } from "@mui/material";

const useDisplay = () => {
	//const isMobile = useMediaQuery("(max-width: 959px)");
	const isMobile = true;
	const isDesktop = useMediaQuery("(min-width: 810px)");

	return { isMobile, isDesktop };
};

export default useDisplay;
