import * as React from "react";
import MaterialTable from "material-table";
import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/styles";
import { DataGridProps } from "./DataGrid.types";
import { useGlobalContext } from "@app/store/globale/global";

interface DataGridGroupingTableProps extends DataGridProps {
  detailPanel?: any;
}

const DataGridGroupingTable = ({
  data = [],
  columns,
  options,
  actions,
  onRowClick = () => {},
  onSelectionChange = () => {},
  detailPanel,
}: DataGridGroupingTableProps) => {
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
            borderBottom: `1px solid ${
              state.theme.mode === "dark" ? "#2D333B" : "#E0E0E0"
            }`,
          },
          head: {
            fontWeight: "bold",
            color: "#FFFFFF",
          },
          body: {
            color: state.theme.mode === "dark" ? "#E0E0E0" : "#000000",
          },
        },
      },
      MuiTableBody: {
        styleOverrides: {
          root: {
            color: state.theme.mode === "dark" ? "#E0E0E0" : "#000000",
          },
        },
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <MaterialTable
        data={data}
        columns={columns}
        options={{
          toolbar: false,
          paging: false,
          headerStyle: {
            backgroundColor:
              state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
            color: state.theme.mode === "dark" ? "#FFFFFF" : "#191E23",
            fontWeight: 600,
            borderBottom: `1px solid ${
              state.theme.mode === "dark" ? "#2D333B" : "#E0E0E0"
            }`,
          },
          rowStyle: () => ({
            backgroundColor:
              state.theme.mode === "dark" ? "#191E23" : "#FFFFFF",
            color: state.theme.mode === "dark" ? "#E0E0E0" : "#000000",
            borderBottom: `1px solid ${
              state.theme.mode === "dark" ? "#2D333B" : "#E0E0E0"
            }`,
          }),

          ...options,
        }}
        actions={actions}
        detailPanel={detailPanel}
        onRowClick={(event, rowData) => onRowClick(event, rowData)}
        onSelectionChange={(rows) => onSelectionChange(rows)}
      />
    </ThemeProvider>
  );
};

export default DataGridGroupingTable;
