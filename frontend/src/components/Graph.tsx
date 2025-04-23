import dayjs from "dayjs";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	ResponsiveContainer,
	Label,
} from "recharts";
import { useThemeMode } from "../hooks/ThemeProvider";
import { Box, Typography } from "@mui/material";

const Graph = ({
	graphData,
	domain,
	title = "Completion Rate (%)",
	labelY = "",
}: {
	graphData: { date: string; value: number }[];
	domain?: [number, number];
	title?: string;
	labelY?: string;
}) => {
	const { theme, isLight } = useThemeMode();
	return (
		<Box className="flex-center col gap3 full-w full-h">
			<Typography variant="body2" color="secondary">
				{title}
			</Typography>
			<ResponsiveContainer
				width="100%"
				height={200}
				style={{ paddingRight: "35px", margin: "auto" }}
			>
				<LineChart data={graphData}>
					<CartesianGrid strokeDasharray="3 3" />
					<XAxis
						dataKey="date"
						tickFormatter={(value) => dayjs(value).format("MM/DD")}
						tick={{ fill: theme.palette.primary.main, fontSize: 12 }}
					/>
					<YAxis
						dataKey="value"
						domain={domain}
						tick={{ fill: theme.palette.primary.main, fontSize: 12 }}
					/>
					{/* <Label
							value={labelY}
							angle={-90}
							position="insideLeft"
							offset={10}
							style={{
								textAnchor: "middle",
								//fill: isLight ? "#555" : "#ccc", // change text color
								fill: theme.palette.secondary.main,
								fontSize: 12,
								fontWeight: 500,
							}}
						/> */}
					{/* </YAxis> */}
					<Line
						type="monotone"
						dataKey="value"
						stroke={isLight ? "#8884d8" : theme.palette.secondary.main}
						strokeWidth={3}
						dot={false}
						activeDot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</Box>
	);
};

export default Graph;
