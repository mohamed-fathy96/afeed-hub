import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useGlobalContext } from "@app/store/globale/global";
import { createTheme, ThemeProvider } from "@mui/material";

type SingleSelectDropdownProps = {
  options: Array<any>;
  optionName?: string;
  optionValue: string;
  selectedValue: any;
  handleChange: (event: any, value: any) => void;
  onInputChange?: (event: any) => void;
  isDisabled?: boolean;
  placeholder?: string | any;
  renderOption?: (option: any) => React.ReactNode;
  size?: "medium" | "small";
  cssStyle?: React.CSSProperties;
  className?: string;
  variant?: "filled" | "outlined" | "standard";
  isError?: boolean;
  errorMsg?: string;
};

const SingleSelectDropdown: React.FC<SingleSelectDropdownProps> = ({
  options,
  optionName = "",
  optionValue,
  selectedValue,
  handleChange,
  isDisabled = false,
  placeholder = "",
  renderOption,
  onInputChange,
  size,
  cssStyle,
  className,
  variant = "outlined",
  isError = false,
  errorMsg = "",
}) => {
  const { state } = useGlobalContext();

  const theme = createTheme({
    palette: {
      mode: state.theme.mode,
      primary: { main: "#00D084" }, // Accent color
      background: {
        default: state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
        paper: state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
      },
      text: {
        primary: state.theme.mode === "dark" ? "#F2F2F2" : "#0F1115",
        secondary: state.theme.mode === "dark" ? "#B0B3B8" : "#5A5A5A",
      },
    },
    components: {
      MuiAutocomplete: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              backgroundColor:
                state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
              "& fieldset": {
                borderColor:
                  state.theme.mode === "dark" ? "#2D333B" : "#E0E0E0",
              },
              "&:hover fieldset": {
                borderColor: "#ddd", // Accent color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "#00D084", // Accent color on focus
              },
            },
          },
          listbox: {
            backgroundColor:
              state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
            color: state.theme.mode === "dark" ? "#F2F2F2" : "#0F1115",
          },
        },
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <Autocomplete
        ListboxProps={{
          style: {
            maxHeight: 200,
          },
        }}
        className={className}
        id="auto-complete"
        options={options} //array of displayed list
        getOptionLabel={(option: any) => option[optionName] ?? ""} //the string value for a given option
        value={options?.find((el) => el[optionValue] == selectedValue) || null} // passing null to prevent the Autocomplete going into uncontrolled mode
        onChange={(e: any, value: any) => handleChange(e, value)} //callback fires when the value changes
        autoComplete
        renderInput={(params) => (
          <TextField
            sx={{ input: { cursor: "pointer" } }}
            {...params}
            label={placeholder}
            size={size}
            onChange={(e: any) => onInputChange && onInputChange(e)}
            variant={variant}
            // InputProps={{
            //   ...params.InputProps,
            //   endAdornment: null,
            // }}
            error={isError}
            helperText={errorMsg}
          />
        )}
        disabled={isDisabled}
        renderOption={renderOption} //to render customized list items
        sx={cssStyle}
      />
    </ThemeProvider>
  );
};

export default SingleSelectDropdown;
