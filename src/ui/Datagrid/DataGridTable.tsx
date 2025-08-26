import * as React from "react";
import MaterialTable from "material-table";
import { createTheme, ThemeProvider } from "@mui/material";
import { DataGridProps } from "./DataGrid.types";
import { useGlobalContext } from "@app/store/globale/global";

export const DataGridTable: React.FC<DataGridProps> = ({
  data = [],
  title = "",
  columns,
  options,
  actions,
  onRowClick = () => {},
  onSelectionChange,
  onUpdate,
}) => {
  const { state } = useGlobalContext();

  const theme = createTheme({
    palette: {
      mode: state.theme.mode, // Dark or light mode
      background: {
        paper: state.theme.mode === "dark" ? "#191E23 !important" : "#fff", // Table container background
        default: state.theme.mode === "dark" ? "#0F1115" : "#fff", // Overall app background
      },
      divider: state.theme.mode === "dark" ? "#2D333B" : "#E0E0E0", // Divider color
      text: {
        primary: state.theme.mode === "dark" ? "#F2F2F2" : "#0F1115", // Text color for headers & body
        secondary: "#B0B3B8", // Subdued text for secondary labels
      },
      primary: {
        main: "#00D084", // Green accent color for buttons or active state
      },
      secondary: {
        main: "#FF4B4B", // Red accent for "Unpaid" or errors
      },
    },
    typography: {
      fontFamily: "Inter, Roboto, Arial, sans-serif",
      fontSize: 14,
      body1: {
        color: state.theme.mode === "dark" ? "#F2F2F2" : "#000",
        backgroundColor: state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
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
            overflow: "hidden",
            borderRadius: 8,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: state.theme.mode === "dark" ? "#E0E0E0" : "#000000",
            border: `1px solid ${
              state.theme.mode === "dark" ? "#2D333B" : "#E0E0E0"
            }`,
            padding: "8px",
          },
          head: {
            fontWeight: "bold",
            color: "#FFFFFF",
            backgroundColor:
              state.theme.mode === "dark"
                ? "#191E23 !important"
                : "#EDF0FE !important",
            fontSize: "14px !important",
          },
          body: {
            color:
              state.theme.mode === "dark" ? "#E0E0E0 !important" : "#000000",
            fontSize: "14px !important",
            overflowY: "hidden",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <MaterialTable
        title={title}
        data={data}
        columns={columns}
        options={{
          search: false,
          grouping: false,
          showTitle: false,
          columnsButton: false,
          paging: false,
          headerStyle: {
            backgroundColor:
              state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
            color: state.theme.mode === "dark" ? "#FFFFFF" : "#191E23",
            fontWeight: 600,
          },
          rowStyle: () => ({
            backgroundColor:
              state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
            color: state.theme.mode === "dark" ? "#E0E0E0" : "#000000",
          }),
          ...options,
        }}
        editable={{
          onRowUpdate: onUpdate,
        }}
        actions={actions}
        onRowClick={(evt, row) => onRowClick(evt, row)}
        onSelectionChange={(rows) =>
          onSelectionChange && onSelectionChange(rows)
        }
      />
    </ThemeProvider>
  );
};
