import { Box, Button, IconButton, Typography } from "@mui/material";

import { useSelector } from "react-redux";
import { selectMeals } from "./foodSelectors";
import {
	FOOD_CATEGORIES,
	IngredientForm,
	isIngredientLog,
	isMealLog,
	isMealSource,
	MealForm,
} from "../../../utils/types";
import { useMemo, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import {
	AddCircle,
	BuildCircleOutlined,
	CheckCircle,
	Delete,
	DinnerDiningOutlined,
	EggAltOutlined,
	RemoveCircle,
} from "@mui/icons-material";
import NumberInput from "../../../components/NumberInput";
import QtyField from "../../../components/QtyField";

interface Props<T extends IngredientForm | MealForm> {
	items: T[];
	qtyMap: Record<string, number>;
	onAddItem: (itemId: string, qty: number) => void;
	newButton?: () => void;
	searchBar?: boolean;
}

const FoodList = <T extends IngredientForm | MealForm>({
	items = [],
	qtyMap = {},
	onAddItem,
	newButton,
	searchBar = true,
}: Props<T>) => {
	const [search, setSearch] = useState("");

	const mealTotals = useSelector(selectMeals) ?? {};

	const searchValue = search.toLowerCase().trim();

	const sortedItems = useMemo(() => {
		return items
			.filter(
				(item) => !searchValue || item.title.toLowerCase().includes(searchValue)
			)
			.sort((a, b) =>
				a.title.toLowerCase().localeCompare(b.title.toLowerCase())
			);
	}, [items, searchValue]);

	const getCalories = (item: IngredientForm | MealForm) => {
		if (isMealLog(item)) return mealTotals[item.id].calories;
		if (isIngredientLog(item)) return item.calories;
	};

	const addButton = (itemId: string, qty: number) => {
		//if (showQty) {
		return (
			<IconButton onClick={() => onAddItem(itemId, qty)}>
				<AddCircle fontSize="small" />
			</IconButton>
		);
		//}
		// if (!showQty) {
		// 	return (
		// 		<IconButton
		// 			onClick={qtyMap[itemId] ? () => {} : () => onAddItem(itemId, qty)}
		// 		>
		// 			{qtyMap[itemId] ? (
		// 				<CheckCircle fontSize="small" color="success" />
		// 			) : (
		// 				<AddCircle fontSize="small" />
		// 			)}
		// 		</IconButton>
		// 	);
		// }
	};

	return (
		<Box
			className="flex-center col gap2 full-w full-h"
			sx={{ overflow: "hidden", justifyContent: "flex-start", p: 1 }}
		>
			<Box className="flex-between full-w">
				{searchBar && (
					<SearchBar value={search} onChange={(value) => setSearch(value)} />
				)}
				{newButton && (
					<Button
						variant={"contained"}
						size="small"
						onClick={() => {
							newButton();
						}}
					>
						New
					</Button>
				)}
			</Box>

			<Box
				className="flex-center col  full-w full-h"
				sx={{ overflowY: "auto", justifyContent: "flex-start" }}
			>
				{sortedItems &&
					sortedItems.map((item) => {
						return (
							<Box key={item.id} className="flex-between full-w">
								<Box className="flex gap2">
									<IconButton size="small">
										{isIngredientLog(item) ? (
											isMealSource(item) ? (
												<BuildCircleOutlined fontSize="small" color="info" />
											) : (
												<EggAltOutlined fontSize="small" color="secondary" />
											)
										) : (
											<DinnerDiningOutlined fontSize="small" color="primary" />
										)}
									</IconButton>
									<Typography variant="body1">
										{item.title} - {getCalories(item)}Cal
									</Typography>
								</Box>
								{/* {isIngredientLog(item) && isMealSource(item) ? (
									<IconButton
										onClick={() => onAddItem(item.id, qtyMap[item.id] - 1)}
									>
										<Delete fontSize="small" color="error" />
									</IconButton>
								) : (
									<Box className="flex-center gap2">
										{qtyMap[item.id] > 0 && (
											<>
												<IconButton
													onClick={() =>
														onAddItem(item.id, qtyMap[item.id] - 1)
													}
												>
													{qtyMap[item.id] === 1 ? (
														<Delete fontSize="small" color="error" />
													) : (
														<RemoveCircle fontSize="small" />
													)}
												</IconButton>
												<NumberInput
													value={qtyMap[item.id]}
													onChange={(value) => onAddItem(item.id, value)}
													sx={{ maxWidth: "40px", fontSize: "10px" }}
												/>
											</>
										)}
										{addButton(item.id, qtyMap[item.id] + 1)}
									</Box>
								)} */}
								<QtyField
									value={qtyMap[item.id] ?? 0}
									onChange={(value) => onAddItem(item.id, value)}
									collapse
									deleteBtn
								/>
							</Box>
						);
					})}
			</Box>
		</Box>
	);
};

export default FoodList;
