import { useEffect } from "react";

const useVisibilityEffect = (onVisible: () => void) => {
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible") onVisible();
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [onVisible]);
};

export default useVisibilityEffect;
