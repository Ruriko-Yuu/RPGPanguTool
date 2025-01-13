import * as React from "react";
import { useElectronMenuStore } from "../../store/useElectronMenu";
import { Link, useNavigate } from "react-router-dom";
const App: React.FC = () => {
	const navigate = useNavigate();
	const tabList = useElectronMenuStore((state: any) => state.tabList);
	const newWorld = () => {
		useElectronMenuStore.getState().newTab({
			title: "new world",
			router: "/project",
		});
		navigate("/project");
	};
	return (
		<>
			<p onClick={newWorld}>newWorld</p>
		</>
	);
};

export default App;
