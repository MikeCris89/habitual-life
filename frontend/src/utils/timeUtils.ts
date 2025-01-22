export const formatTime = (
	time: string | undefined,
	today: Date = new Date()
): string => {
	if (!time) return "";

	const utcDate = new Date(time);
	today.setHours(utcDate.getHours(), utcDate.getMinutes(), 0, 0);
	return today.toISOString();
};

export const startOfDay = (): string =>
	new Date(new Date().setHours(0, 0, 0, 0)).toISOString();

export const startOfWeek = (): string => {
	const date = new Date(startOfDay());
	const dayOfWeek = date.getDay();

	date.setDate(date.getDate() - dayOfWeek);
	return date.toISOString();
};

export const endOfWeek = (): string => {
	const date = new Date(startOfWeek());
	date.setDate(date.getDate() + 7);

	return date.toISOString();
};
