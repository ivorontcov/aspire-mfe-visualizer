import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import Graph2D from "../components/Graph2D";
import { genRandomTree } from "../helpers/commonHelpers";

const Sandbox = () => {
  const { appSettings } = useContext(MainContext);
  const graphData = genRandomTree(appSettings.graphSize);

  return <Graph2D graphData={graphData} />;
};

export default Sandbox;
