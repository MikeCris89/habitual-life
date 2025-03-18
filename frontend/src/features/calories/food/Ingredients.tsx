import { Box, Button } from "@mui/material";
import { useAddEditIngredientMutation, useGetFoodQuery } from "./foodApi";
import Loading from "../../../components/Loading";
import { handleError } from "../../../utils/errors";

const Ingredients = () => {
	const {
		data: { ingredients } = {},
		isLoading: loadingIng,
		error: errorIng,
	} = useGetFoodQuery();

	const [addEditIng] = useAddEditIngredientMutation();

	if (loadingIng) return <Loading />;
	if (errorIng) handleError(`Error loading food. Error: ${errorIng}`);

	const handleAddIng = () => {};

	return (
		<Box>
			<Button variant="contained">New</Button>
			{ingredients && (
				<Box className="flex-center col gap2" sx={{ width: "100%" }}>
					{ingredients.map((ing) => {
						return (
							<Box key={ing.id}>
								{ing.title} - {ing.calories}Cal
							</Box>
						);
					})}
				</Box>
			)}
		</Box>
	);
};

export default Ingredients;
