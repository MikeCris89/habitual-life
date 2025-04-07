import { useSelector } from "react-redux";
import { selectCurrentBasket } from "../features/calories/basketsSelectors";
import {
	useAddBasketMutation,
	useDeleteBasketMutation,
	useGetBasketsQuery,
} from "../features/calories/food/foodApi";
import { useCurrBasketId } from "../features/calories/CalorieLog";
import {
	Baskets,
	CustomForm,
	FOOD_CATEGORIES,
	FoodCategory,
} from "../utils/types";
import { handleError } from "../utils/errors";

const useBasketUpdater = () => {
	const { data: allBaskets } = useGetBasketsQuery();
	const currentBasketId = useCurrBasketId();
	const currBasket = useSelector((state) =>
		selectCurrentBasket(state, currentBasketId)
	);
	const [addBasket] = useAddBasketMutation();
	const [deleteBasket] = useDeleteBasketMutation();

	const findBasket = (basketId: string) => {
		const thisBasket =
			basketId === currentBasketId
				? currBasket
				: allBaskets?.find((bask) => bask.id === basketId);
		if (thisBasket) return thisBasket;
		handleError("Basket not found");
	};

	const isBasketEmpty = (basket: Baskets) => {
		return !(
			basket.ingredients.length ||
			basket.meals.length ||
			basket.custom.length
		);
	};

	const handleEditBasketItem = (
		basketId: string,
		foodCat: Exclude<FoodCategory, "custom">,
		itemId: string,
		qty: number
	) => {
		const thisBasket = findBasket(basketId);

		const itemExists = thisBasket[foodCat].find((el) => el.id === itemId);
		if (!itemExists && qty === 0) return;
		let newBasket: Baskets;
		if (itemExists) {
			newBasket = {
				...thisBasket,
				[foodCat]:
					qty > 0
						? thisBasket[foodCat].map((item) =>
								item.id === itemId ? { ...item, qty } : item
						  )
						: thisBasket[foodCat].filter((item) => item.id !== itemId),
			};
		} else {
			newBasket = {
				...thisBasket,
				[foodCat]: [...thisBasket[foodCat], { id: itemId, qty }],
			};
		}

		addBasket(newBasket);
		if (isBasketEmpty(newBasket)) {
			deleteBasket(basketId);
		}
	};

	const handleEditCustomItem = (
		basketId: string,
		item: CustomForm,
		qty: number
	) => {
		const thisBasket = findBasket(basketId);
		const foodCat = FOOD_CATEGORIES.CUSTOM;
		let newBasket: Baskets;
		const itemExists = thisBasket[foodCat].find((el) => el.id === item.id);
		if (!itemExists && qty === 0) return;
		if (itemExists) {
			newBasket = {
				...thisBasket,
				[foodCat]:
					qty > 0
						? thisBasket[foodCat].map((custItem) =>
								custItem.id === item.id ? { ...custItem, qty } : custItem
						  )
						: thisBasket[foodCat].filter((custItem) => custItem.id !== item.id),
			};
		} else {
			newBasket = {
				...thisBasket,
				[foodCat]: [...thisBasket[foodCat], { ...item, qty }],
			};
		}
		if (isBasketEmpty(newBasket)) {
			deleteBasket(basketId);
		} else {
			addBasket(newBasket);
		}
	};

	return {
		handleEditBasketItem,
		handleEditCustomItem,
	};
};

export default useBasketUpdater;
