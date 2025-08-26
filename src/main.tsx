import ReactDOM from "react-dom/client";
import "./colors.css";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
// Store configuration
import { Provider } from "react-redux";
import { store } from "./store";
import Router from "./routing/RoutesProvider";

// Assuming your root element has an id of 'root'
const rootElement = document.getElementById("root");

// Check if the root element exists before rendering
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Router />
      </Provider>
    </BrowserRouter>
    // </React.StrictMode>
  );
}
