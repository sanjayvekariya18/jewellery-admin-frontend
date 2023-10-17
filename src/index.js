import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material";
import App from "./App";

import { Provider } from "react-redux";
import { store } from "./slices";

// third party style
import "perfect-scrollbar/css/perfect-scrollbar.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<StyledEngineProvider injectFirst>
			<BrowserRouter>
				<React.StrictMode>
					<App />
				</React.StrictMode>
			</BrowserRouter>
		</StyledEngineProvider>
	</Provider>
);
