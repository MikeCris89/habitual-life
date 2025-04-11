import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { selectMeals } from "./foodSelectors";
import {
	IngredientForm,
	isIngredientLog,
	isMealLog,
	isMealSource,
	MealForm,
} from "../../../utils/types";
import { useMemo, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import {
	BuildCircleOutlined,
	DinnerDiningOutlined,
	EggAltOutlined,
} from "@mui/icons-material";
import QtyField from "../../../components/QtyField";

interface Props<T extends IngredientForm | MealForm> {
	items: T[];
	qtyMap: Record<string, number>;
	onAddItem: (itemId: string, qty: number) => void;
	newButton?: () => void;
	onItemClick?: (id: string) => void;
	searchBar?: boolean;
}

const FoodList = <T extends IngredientForm | MealForm>({
	items = [],
	qtyMap = {},
	onAddItem,
	newButton,
	onItemClick,
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
				className="flex-center col gap3 full-w full-h"
				sx={{ overflowY: "auto", justifyContent: "flex-start" }}
			>
				{sortedItems && !sortedItems.length && (
					<Typography variant="h6">No items..</Typography>
				)}
				{sortedItems &&
					sortedItems.map((item) => {
						return (
							<Box key={item.id} className="flex-between gap1 full-w">
								<Box
									className="flex gap2 full-w"
									sx={{
										px: 1,
										py: 0.5,
										...(onItemClick && {
											borderBottom: "1px solid",
											borderColor: "divider",
											"&:hover": {
												backgroundColor: "action.hover",
												cursor: "pointer",
											},
										}),
									}}
									onClick={onItemClick ? () => onItemClick(item.id) : undefined}
								>
									{isIngredientLog(item) ? (
										isMealSource(item) ? (
											<BuildCircleOutlined fontSize="small" color="info" />
										) : (
											<EggAltOutlined fontSize="small" color="secondary" />
										)
									) : (
										<DinnerDiningOutlined fontSize="small" color="primary" />
									)}

									<Box className="flex-between gap2 full-w">
										<Typography variant="body1">{item.title}</Typography>
										<Typography variant="body2">
											{getCalories(item)}Cal
										</Typography>
									</Box>
								</Box>
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
