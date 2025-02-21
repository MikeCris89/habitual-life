export const startOfDay = (date: Date = new Date()): string =>
	new Date(date.setHours(0, 0, 0, 0)).toISOString();

export const nextDay = (date: Date = new Date()): string => {
	const nextDay = new Date(startOfDay(date));
	nextDay.setDate(date.getDate() + 1);
	return new Date(nextDay).toISOString();
};

export const startOfWeek = (date: Date = new Date()): string => {
	const dayOfWeek = date.getDay();

	date.setDate(date.getDate() - dayOfWeek);
	return new Date(date.setHours(0, 0, 0, 0)).toISOString();
};

export const endOfWeek = (date: Date = new Date()): string => {
	const end = new Date(startOfWeek(date));
	end.setDate(date.getDate() + 7);

	return new Date(end).toISOString();
};
