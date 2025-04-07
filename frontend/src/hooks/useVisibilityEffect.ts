import { useEffect } from "react";

const useVisibilityEffect = (onVisible: () => void) => {
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") onVisible();
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		//test to run function if also visible
		//if (document.visibilityState === "visible") onVisible();

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [onVisible]);
};

export default useVisibilityEffect;
