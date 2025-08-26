import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { routes } from "@app/lib/routes";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
  },
  icon: {
    fontSize: 200,
    color: theme.palette.success.main,
  },
  message: {
    margin: theme.spacing(4),
    textAlign: "center",
  },
  button: {
    marginTop: theme.spacing(4),
    backgroundColor: theme.palette.success.main,
    color: "#fff",
  },
}));

const SuccessPage = () => {
  const { t } = useTranslation();
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const message = searchParams.get("message");
  return (
    <div className={classes.root}>
      <CheckCircle className={classes.icon} sx={{ fontSize: "100px" }} />
      <Typography variant="h4" component="h1" className={classes.message}>
        {t("Success")}! {message ?? message}
      </Typography>
      <Button
        size="large"
        variant="contained"
        className={classes.button}
        onClick={() => navigate(routes.dashboard.statistics)}
      >
        {t("Continue")}
      </Button>
    </div>
  );
};

export default SuccessPage;
