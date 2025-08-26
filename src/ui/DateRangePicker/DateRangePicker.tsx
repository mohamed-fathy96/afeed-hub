import React, { useState, useEffect } from "react";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { Button, createTheme, ThemeProvider } from "@mui/material";
import { useGlobalContext } from "@app/store/globale/global";

interface DateRange {
  startDate: Date;
  endDate: Date;
  key?: string;
}

interface DateRangePickerProps {
  setShowDatePicker: (show: boolean) => void;
  dateRange: DateRange;
  handleDateRangeChange: (item: { selection: DateRange }) => void;
  setInit?: (value: boolean) => void;
  setVal?: (value: DateRange) => void;
  idval?: string;
  minDate?: Date;
  handleApplyDateRange: () => void;
}

const DateRangePickerComponent: React.FC<DateRangePickerProps> = ({
  setShowDatePicker,
  dateRange,
  handleDateRangeChange,
  setInit,
  setVal,
  idval,
  minDate,
  handleApplyDateRange,
}) => {
  const { state } = useGlobalContext();
  const [isRight, setIsRight] = useState(false);

  useEffect(() => {
    const element = document.getElementById(idval ?? "date-range-picker");
    if (element) {
      const elementRect = element.getBoundingClientRect();
      const isRightValue = (elementRect.left * 100) / window.innerWidth > 44;
      setIsRight(isRightValue);
    }
  }, [idval]);

  const handleClear = () => {
    if (setInit) {
      setInit(true);
    }
    if (setVal) {
      setVal({
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      });
      setShowDatePicker(false);
    }
  };

  const handleApply = () => {
    handleApplyDateRange();
    setShowDatePicker(false);
  };

  const handleLeftAmount = () => {
    return window?.screen?.width < 500 ? 0 : setInit ? "5%" : "9%";
  };

  const theme = createTheme({
    palette: {
      mode: state.theme.mode,
      background: {
        default: state.theme.mode === "dark" ? "#0F1115" : "#FFFFFF",
        paper: state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
      },
      text: {
        primary: state.theme.mode === "dark" ? "#F2F2F2" : "#000000",
        secondary: state.theme.mode === "dark" ? "#B0B3B8" : "#7D7D7D",
      },
    },
    typography: {
      fontFamily: "Inter, Roboto, Arial, sans-serif",
      fontSize: 14,
      body1: {
        color: state.theme.mode === "dark" ? "#F2F2F2" : "#000000",
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor:
              state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
            border: `1px solid ${
              state.theme.mode === "dark" ? "#2D333B" : "#E0E0E0"
            }`,
            borderRadius: 8,
            overflow: "hidden",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <ClickAwayListener onClickAway={() => setShowDatePicker(false)}>
        <div
          id={idval ?? "date-range-picker"}
          style={{
            position: "fixed",
            top: 75,
            zIndex: 3000,
            border: "1px solid #eee",
            right: isRight ? 15 : undefined,
          }}
          className="bg-base-100"
        >
          <DateRangePicker
            ranges={[dateRange]}
            months={2}
            onChange={(item: any) => {
              handleDateRangeChange(item);
              console.log(item);
            }}
            classNames={{
              staticRanges: `rdrStaticRange ${
                state.theme.mode === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-black"
              }`,
            }}
            direction={window.screen.width < 500 ? "vertical" : "horizontal"}
            moveRangeOnFirstSelection={false}
            minDate={minDate}
            rangeColors={[state.theme.mode === "dark" ? "#00D084" : "#3f51b5"]}
          />
          <Button
            variant="outlined"
            color="success"
            style={{
              position: "absolute",
              left: handleLeftAmount(),
              bottom: window.screen.width < 500 ? 0 : 10,
              padding: 6,
              fontSize: 13,
            }}
            onClick={handleApply}
            className="btn btn-primary mr-1"
            type="button"
          >
            Apply
          </Button>
          {setInit && setVal && (
            <Button
              variant="outlined"
              color="secondary"
              style={{
                position: "absolute",
                left: window?.screen?.width < 500 ? 0 : "15%",
                bottom: window?.screen?.width < 500 ? 0 : 10,
                padding: 6,
                fontSize: 13,
              }}
              onClick={handleClear}
              className="btn btn-light mr-1"
              type="button"
            >
              Clear
            </Button>
          )}
        </div>
      </ClickAwayListener>
    </ThemeProvider>
  );
};

export default DateRangePickerComponent;
