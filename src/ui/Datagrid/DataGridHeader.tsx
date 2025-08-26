import React from "react";
import classes from "./DataGrid.module.scss";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import { IDataGridHeaderProps } from "./DataGrid.types";
import Button from "../Button/Button";
import { useTranslator } from "@app/lib/hooks/useTranslator";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  color: "var(--black-color)",
  backgroundColor: "white",
  marginInlineStart: theme.spacing(2),
  marginLeft: 0,
  border: "1px solid #E4E4E4",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingInlineStart: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const DataGridHeader: React.FC<IDataGridHeaderProps> = ({
  title,
  btnTitle = "",
  handleSearch,
  params,
  isSearchAllowed = true,
  children,
  handleClick,
}) => {
  const { __T } = useTranslator();
  return (
    <div className={classes.dateGridHeaderWrapper}>
      <Grid className={classes.searchInputWrapper} container>
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: { xs: 1, md: 0 },
          }}
          item
          xs={12}
          md={6}
        >
          <Typography
            fontSize={"20px"}
            component="div"
            fontWeight={900}
            sx={{ display: { xs: "none", sm: "block" } }}
            textAlign={"start"}
          >
            {title}
          </Typography>
          {isSearchAllowed && (
            <Search onChange={handleSearch} defaultValue={params?.searchKey}>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                defaultValue={params?.searchKey}
                placeholder={__T(`Search here`)}
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
          )}
        </Grid>

        {btnTitle && (
          <Grid
            sx={{ display: "flex", justifyContent: { md: "end", xs: "start" } }}
            item
            xs={12}
            md={6}
          >
            <Button onClick={handleClick}>{btnTitle}</Button>
          </Grid>
        )}
        {children}
      </Grid>
    </div>
  );
};

export default DataGridHeader;
