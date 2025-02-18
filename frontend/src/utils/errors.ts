import { dbActions } from "./indexedDb";

export const logError = (error: unknown) => {
	dbActions.logError(error).catch((e) => console.error(e));
};

type ErrorType = (error: unknown) => never;

export const handleError: ErrorType = (error) => {
	// log error
	console.error(error);
	logError(error);

	// throw generic error to user
	throw new Error("handleErrorThrow");
};
