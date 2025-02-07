export const formatTime = (
	time: string | undefined,
	today: Date = new Date()
): string => {
	if (!time) return "";

	const utcDate = new Date(time);
	today.setHours(utcDate.getHours(), utcDate.getMinutes(), 0, 0);
	return today.toISOString();
};

export const startOfDay = (date: Date = new Date()): string =>
	new Date(date.setHours(0, 0, 0, 0)).toISOString();

export const startOfWeek = (date: Date = new Date()): string => {
	const dayOfWeek = date.getDay();

	date.setDate(date.getDate() - dayOfWeek);
	return new Date(date.setHours(0, 0, 0, 0)).toISOString();
};

export const endOfWeek = (date: Date = new Date()): string => {
	const end = new Date(startOfWeek(date));
	end.setDate(date.getDate() + 7);

	return end.toISOString();
};
