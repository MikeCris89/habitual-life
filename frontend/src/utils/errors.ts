import { dbActions } from "./indexedDb";

const errorCache = new Set();
let lastErrorTime = 0;
const MAX_ERROR_LOGS = 500;
const ERROR_THROTTLE_TIME = 5000;

export const getErrorHash = (error: unknown) => {
	try {
		const errorString = JSON.stringify(
			error,
			Object.getOwnPropertyNames(error)
		);
		return btoa(errorString).slice(0, 20);
	} catch {
		return "UNKNOWN_ERROR_HASH";
	}
};

export const logError = async (
	message: string,
	error: ErrorType
): Promise<void> => {
	const now = Date.now();
	const errorHash = getErrorHash(error);

	if (errorCache.has(errorHash)) return; // Prevent duplicate logs
	errorCache.add(errorHash);

	// Check if error has been logged before in IndexedDB
	const pastErrors = await dbActions.getAll("errorLogs");
	const existingError = pastErrors.find(
		(e: any) => getErrorHash(e) === errorHash
	);
	if (existingError) return; // Prevent duplicate logging across sessions

	if (now - lastErrorTime < ERROR_THROTTLE_TIME) return; // Prevent spam
	lastErrorTime = now;

	if (pastErrors.length >= MAX_ERROR_LOGS) pastErrors.shift(); // Remove oldest entry

	const err =
		error instanceof Error
			? {
					...error,
					message: `${message} | ${error.message}`,
					stack: error.stack,
					name: error.name,
			  }
			: { message, error };

	const errString = JSON.stringify(err, null, 2);
	pastErrors.push(errString);
	await dbActions.logError(errString).catch(console.error);
	console.error(`LOGGED ERROR: ${message}`, err);
};

type ErrorType = Error | unknown;

type ErrorHandler = (message: string, error?: ErrorType) => never;

export const handleError: ErrorHandler = (
	message = "Generic Error.",
	error
): never => {
	// log error
	void logError(message, error ?? undefined);

	// throw generic error to user
	throw new Error("handleErrorThrow");
};
