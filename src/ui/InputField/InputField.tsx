import React, { useEffect, useState } from "react";
import {
  TextField,
  InputAdornment,
  IconButton,
  InputProps,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useGlobalContext } from "@app/store/globale/global";

export type InputStyles = "filled" | "outlined" | "standard";

export interface InputFieldProps extends React.ComponentProps<"input"> {
  inputFieldClass?: string;
  labelClass?: string;
  label?: string;
  errorMessage?: string;
  required?: boolean;
  variant?: InputStyles;
  inputProps?: InputProps;
  setFormikFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  testId?: string;
  register?: any;
  errorMessageClass?: string;
  bgColor?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  onChange,
  onBlur,
  inputFieldClass,
  type = "text",
  variant = "outlined",
  label,
  required = false,
  id,
  name,
  disabled = false,
  errorMessage,
  placeholder,
  value = "",
  inputProps = {},
  setFormikFieldValue,
  register,
  bgColor = "#fff",
}) => {
  const [fieldValue, setFieldValue] = useState(value);
  const { state } = useGlobalContext();

  const [showPassword, setShowPassword] = useState(false);
  const theme = createTheme({
    palette: {
      mode: state.theme.mode,
      background: {
        default: state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
        paper: state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
      },
      text: {
        primary: state.theme.mode === "dark" ? "#F2F2F2" : "#0F1115",
        secondary: state.theme.mode === "dark" ? "#B0B3B8" : "#5A5A5A",
      },
      primary: {
        main: "#00D084", // Accent color
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor:
                  state.theme.mode === "dark" ? "#2D333B" : "#E0E0E0",
              },
              "&:hover fieldset": {
                borderColor: "#5A5A5A", // Hover accent color
              },
              "&.Mui-focused fieldset": {
                borderColor: "#5A5A5A",
              },
            },
            "& .MuiInputLabel-root": {
              color: state.theme.mode === "dark" ? "#B0B3B8" : "#5A5A5A",
            },
            "& .MuiFormHelperText-root": {
              color: state.theme.mode === "dark" ? "#FF4B4B" : "#D32F2F",
            },
          },
        },
      },
    },
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    setFieldValue(value);
    if (setFormikFieldValue && name) {
      setFormikFieldValue(name, value);
    }
  }, [value, name, setFormikFieldValue]);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const inputPropsWithPasswordToggle: InputProps =
    type === "password"
      ? {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleTogglePasswordVisibility} edge="end">
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }
      : {};

  return (
    <ThemeProvider theme={theme}>
      <TextField
        fullWidth
        value={fieldValue}
        onChange={handleChange}
        onBlur={onBlur}
        className={inputFieldClass}
        type={showPassword ? "text" : type}
        label={label}
        variant={variant}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        id={id}
        name={name}
        inputRef={register}
        InputProps={{
          ...inputProps,
          ...inputPropsWithPasswordToggle,
        }}
        error={Boolean(errorMessage)}
        sx={{
          backgroundColor: state.theme.mode === "dark" ? "#191E23" : bgColor,
          borderRadius: "4px",
          "& .MuiOutlinedInput-root": {
            color: state.theme.mode === "dark" ? "#F2F2F2" : "#0F1115",
          },
        }}
        helperText={errorMessage}
      />
    </ThemeProvider>
  );
};
