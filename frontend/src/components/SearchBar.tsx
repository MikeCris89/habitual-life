import { Close, Search } from "@mui/icons-material";
import { Box, TextField } from "@mui/material";

interface SearchProps {
	onChange: (value: string) => void;
	value: string;
}

const SearchBar = ({ onChange, value }: SearchProps) => {
	return (
		<Box className="flex-center gap2">
			<Search />
			<TextField
				type="text"
				size="small"
				label="search..."
				onChange={(e) => onChange(e.target.value)}
				value={value}
				sx={{
					p: 0,
					m: 0,
					fontSize: "12px",
					"& .MuiOutlinedInput-root": {
						padding: 0,
					},
					"& .MuiInputBase-input": {
						fontSize: "12px",
						p: 1,
					},
					"& label": { fontSize: "12px" },
				}}
			/>
			{value && <Close fontSize="small" onClick={() => onChange("")} />}
		</Box>
	);
};

export default SearchBar;
