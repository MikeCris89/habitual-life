import { nanoid } from "nanoid";
import { Baskets, CustomForm, FOOD_CATEGORIES } from "../../utils/types";
import LogForm from "./LogForm";
import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { useAddBasketMutation } from "./food/foodApi";
import { useSelector } from "react-redux";
import { selectCurrentBasket } from "./basketsSelectors";
import { useCurrBasketId } from "./CalorieLog";

const initCustom: CustomForm = {
	calories: 0,
	macros: {},
	qty: 1,
	id: "",
};

const CustomLog = () => {
	const [addBasket] = useAddBasketMutation();
	const currentBasketId = useCurrBasketId();
	const currBasket = useSelector((state) =>
		selectCurrentBasket(state, currentBasketId)
	);
	const [form, setForm] = useState({ ...initCustom });

	const handleChange = (key: string, value: any) => {
		setForm((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const handleChangeMacros = (id: string, value: number) => {
		setForm((prev) => ({
			...prev,
			macros: { ...prev.macros, [id]: value },
		}));
	};

	const handleSubmit = () => {
		console.log(currBasket);
		if (currBasket) {
			const newBasket: Baskets = {
				...currBasket,
				custom: [...currBasket.custom, { ...form, id: nanoid() }],
			};
			addBasket(newBasket);
			setForm({ ...initCustom });
		}
	};

	return (
		<Box
			className="flex-between col gap2 full-h wull-w"
			sx={{ overflow: "hidden" }}
		>
			<Typography variant="body1">Quick Add</Typography>
			<LogForm
				calories={form.calories}
				macros={form.macros}
				handleChangeCalories={handleChange}
				handleChangeMacros={handleChangeMacros}
			/>
			<Button variant="contained" onClick={handleSubmit} fullWidth>
				Add To basket
			</Button>
		</Box>
	);
};

export default CustomLog;
