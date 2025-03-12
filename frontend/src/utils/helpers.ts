export const stringToNum = (value: string): number => {
	// Keeps numbers & decimal points
	const num = value.replace(/[^0-9.]/g, "");
	return num === "" ? NaN : Number(num);
};
