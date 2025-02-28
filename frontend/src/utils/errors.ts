import { dbActions } from "./indexedDb";

const errorCache = new Set();
let lastErrorTime = 0;
const MAX_ERROR_LOGS = 500;
const ERROR_THROTTLE_TIME = 5000;

export const getErrorHash = (error: unknown) => {
	const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error));
	return btoa(errorString).slice(0, 20);
};

export const logError = async (error: unknown) => {
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

	pastErrors.push(error);
	await dbActions.logError(error).catch((e) => console.error(e));
	console.error(error);
};

type ErrorType = (error: unknown) => never;

export const handleError: ErrorType = (error) => {
	// log error

	logError(error);

	// throw generic error to user
	throw new Error("handleErrorThrow");
};
