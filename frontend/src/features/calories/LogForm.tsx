import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import NumberInput from "../../components/NumberInput";
import { FoodFormTypes, MacrosType, MealForm } from "../../utils/types";
import { useSelector } from "react-redux";
import { selectCalorieHabit } from "./food/foodSelectors";

interface Props {
	calories: number;
	macros: Record<string, number>;
	handleChangeCalories: (key: string, value: any) => void;
	handleChangeMacros: (id: string, value: number) => void;
	//handleSubmit: () => void;
}

const LogForm = ({
	handleChangeCalories,
	handleChangeMacros,
	//handleSubmit,
	calories,
	macros,
}: Props) => {
	const baseMacros = useSelector(selectCalorieHabit)?.macros;

	return (
		<Box
			className="flex-between col full-w full-h"
			sx={{
				p: 1,
				overflow: "hidden",
			}}
		>
			<Box
				className="flex-center col gap3 full-w full-h"
				sx={{ overflow: "auto" }}
			>
				{/* <NumberInput
					label="Calories"
					value={calories ?? 0}
					onChange={(value) => handleChangeCalories("calories", value)}
					fullWidth={false}
					sx={{ marginTop: "5px", fontWeight: "bold" }}
					min={0}
					max={9999}
					size="small"
					required={false}
					//delayChange={true}
				/> */}
				{/* </Box> */}
				<TableContainer>
					<Table size="small" stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: "bold" }}>Calories</TableCell>
								<TableCell align="right">
									<NumberInput
										value={macros[calories] ?? 0}
										onChange={(value) =>
											handleChangeCalories("calories", value)
										}
										size="small"
										fullWidth={false}
										min={0}
										max={9999}
										sx={{ width: "75px" }}
										required={false}
										//delayChange={true}
									/>
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{baseMacros?.map((macro) => (
								<TableRow key={macro.id}>
									<TableCell component="th" scope="row">
										{macro.label} {`(${macro.unit})`}
									</TableCell>
									<TableCell align="right">
										<NumberInput
											value={macros[macro.id] ?? 0}
											onChange={(value) => handleChangeMacros(macro.id, value)}
											size="small"
											fullWidth={false}
											min={0}
											max={9999}
											sx={{ width: "75px" }}
											required={false}
											//delayChange={true}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
			{/* <Button variant="contained" onClick={handleSubmit} fullWidth>
				Submit
			</Button> */}
		</Box>
	);
};

export default LogForm;
