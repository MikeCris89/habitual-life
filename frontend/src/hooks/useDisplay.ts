import { useMediaQuery } from "@mui/material";

const useDisplay = () => {
	const isMobile = useMediaQuery("(max-width: 959px)");

	return { isMobile };
};

export default useDisplay;
