import { HashRouter, Routes, Route, RouteProps } from "react-router-dom";
import config from "./router.conf";
import { Component } from "react";
import React from "react";

const render = (config: any[]) => {
	return config.map((item, index) => {
		return (
			<Route
				key={index}
        path={item.path}
        id={item.name}
        handle={item.handle}
				element={
					<>
						{item.layout ? (
							<item.layout>
								<item.element />
							</item.layout>
						) : (
							<item.element />
						)}
					</>
				}
			>
				{item.children ? render(item.children) : ""}
			</Route>
		);
	});
};
class MainRoute extends Component {
	render() {
		return (
			<>
				<HashRouter>
					<Routes>
						{render(config)}
						<Route path="*" element={404} />
					</Routes>
				</HashRouter>
				{/* <KanbanGirl /> */}
			</>
		);
	}
	componentDidMount() {
		// ?
	}
}
export default MainRoute;
