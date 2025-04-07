import dayjs from "dayjs";

export const startOfDay = (date: string = new Date().toISOString()): string =>
	new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString();

export const nextDay = (date: string = startOfDay()): string => {
	return dayjs(date).add(1, "day").toISOString();
};

export const dayBefore = (stringDate: string = startOfDay()): string => {
	const date = new Date(stringDate).setHours(0, 0, 0, 0);
	return dayjs(date).subtract(1, "day").toISOString();
};

export const startOfWeek = (stringDate: string = startOfDay()): string => {
	const date = new Date(stringDate);
	const dayOfWeek = date.getDay();
	date.setDate(date.getDate() - dayOfWeek);
	return new Date(date.setHours(0, 0, 0, 0)).toISOString();
};

export const endOfWeek = (stringDate: string = startOfDay()): string => {
	const date = dayjs(startOfWeek(stringDate));
	const end = date.add(7, "days");
	return end.toISOString();
};

export const statsStartDate = () => {
	return dayjs(startOfDay()).subtract(30, "days").toISOString();
};

export const formatMsTime = (ms: number): string => {
	const minutes = Math.floor(ms / 1000 / 60);
	let seconds = Math.floor((ms / 1000) % 60);

	return `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}`;
};

export const formatSecondsTime = (sec: number): string => {
	const minutes = Math.floor(sec / 60);
	let seconds = Math.floor(sec % 60);

	return `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}`;
};

export const formatDateToTime = (
	dateStr: string,
	twelveHour: boolean = true
): string => {
	if (twelveHour) return dayjs(dateStr).format("hh:mm A");
	else return dayjs(dateStr).format("HH:mm");
};
