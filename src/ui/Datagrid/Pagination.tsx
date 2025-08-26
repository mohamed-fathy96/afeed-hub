import React from "react";
import { Pagination as MaterialPagination } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { PaginationComponentProps } from "./DataGrid.types";
import { useGlobalContext } from "@app/store/globale/global";
import { useNavigate } from "react-router-dom";
import { convertObjectIntoQueryParams } from "@app/lib/helpers/constants/helpers";
const options = [10, 20, 50];
const Pagination: React.FC<PaginationComponentProps> = ({
  pageCount = 1,
  pageNumber = 1,
  pageSize = 50,
  setParams,
  params,
}) => {
  const { state } = useGlobalContext();
  const navigate = useNavigate();
  const handleSelect = async (key: string, value: number) => {
    if (setParams) {
      setParams({ ...params, [key]: value });
    }
    const queryString = convertObjectIntoQueryParams({
      ...params,
      [key]: value,
    });
    navigate({ search: queryString });
  };

  // Define a dynamic theme based on the global state
  const theme = createTheme({
    palette: {
      mode: state.theme.mode,
      primary: {
        main: state.theme.mode === "dark" ? "#90caf9" : "#1976d2",
      },
      secondary: {
        main: state.theme.mode === "dark" ? "#f48fb1" : "#9c27b0",
      },
      background: {
        default: state.theme.mode === "dark" ? "#121212" : "#fff",
        paper: state.theme.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <div className="flex justify-between mt-4">
        <select
          className={`w-16 border rounded-md py-2 px-3 text-sm ${
            state.theme.mode === "dark"
              ? "bg-gray-800 text-white border-gray-700"
              : "bg-white text-black border-gray-300"
          }`}
          value={pageSize}
          onChange={(e) => handleSelect("pageSize", Number(e.target.value))}
        >
          {options.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
        <MaterialPagination
          color={state.theme.mode === "dark" ? "primary" : "secondary"}
          variant="outlined"
          shape="rounded"
          count={+pageCount}
          page={+pageNumber}
          onChange={(_event, value) => handleSelect("pageNumber", value)}
        />
      </div>
    </ThemeProvider>
  );
};

export default Pagination;
