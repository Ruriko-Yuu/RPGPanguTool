import * as React from "react";
import { createRoot } from "react-dom/client";
import Route from "./router/index";
import "./index.scss";
import "./index.css";
const container = document.getElementById("react");
const root = createRoot(container);
window.echo = console.info;
root.render(
	<React.StrictMode>
		<Route />
	</React.StrictMode>
);
