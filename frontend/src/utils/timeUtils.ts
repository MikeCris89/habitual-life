import dayjs from "dayjs";

export const startOfDay = (date: string = new Date().toISOString()): string =>
	new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString();

export const nextDay = (date: string = startOfDay()): string => {
	return dayjs(date).add(1, "day").toISOString();
};

export const dayBefore = (date: string = startOfDay()): string => {
	return dayjs(date).subtract(1, "day").toISOString();
};

export const startOfWeek = (stringDate: string = startOfDay()): string => {
	const date = new Date(stringDate);
	const dayOfWeek = date.getDay();

	date.setDate(date.getDate() - dayOfWeek);
	return new Date(date.setHours(0, 0, 0, 0)).toISOString();
};

export const endOfWeek = (stringDate: string = startOfDay()): string => {
	const date = new Date(stringDate);
	const end = new Date(startOfWeek(stringDate));
	end.setDate(date.getDate() + 7);

	return new Date(end).toISOString();
};

export const statsStartDate = () => {
	return dayjs(startOfDay()).subtract(30, "days").toISOString();
};
