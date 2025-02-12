import { dbActions } from "./indexedDb";

export const handleError = (error: unknown, throwBoundary: boolean = true) => {
	// log error
	dbActions.logError(error).catch((e) => console.error(e));

	// throw generic error to user
	if (throwBoundary) {
		throw new Error("handleErrorThrow");
	}
};
