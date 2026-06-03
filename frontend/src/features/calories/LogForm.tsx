import {
	Box,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
} from "@mui/material";
import NumberInput from "../../components/NumberInput";
import { useSelector } from "react-redux";
import { selectCalorieHabit } from "./food/foodSelectors";

interface Props {
	calories: number;
	macros: Record<string, number>;
	handleChangeCalories: (key: string, value: any) => void;
	handleChangeMacros: (id: string, value: number) => void;
}

const LogForm = ({
	handleChangeCalories,
	handleChangeMacros,
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
				<TableContainer>
					<Table size="small" stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell sx={{ fontWeight: "bold" }}>Calories</TableCell>
								<TableCell align="right">
									<NumberInput
										value={calories ?? 0}
										onChange={(value) =>
											handleChangeCalories("calories", value)
										}
										size="small"
										fullWidth={false}
										min={0}
										max={9999}
										sx={{ width: "75px" }}
										required={false}
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
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			</Box>
		</Box>
	);
};

export default LogForm;
