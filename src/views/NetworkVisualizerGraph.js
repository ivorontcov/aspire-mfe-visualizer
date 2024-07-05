import React, { useContext } from "react";
import { MainContext } from "../contexts/MainContext";
import GraphPending from "../components/Visualizer/GraphPending";
import GraphRendering from "../components/Visualizer/GraphRendering";

const NetworkVisualizerGraph = () => {
  const { networkGraph } = useContext(MainContext);

  console.log("networkGraph:", networkGraph);

  if (!networkGraph) {
    return <GraphPending />;
  }

  return <GraphRendering graph={networkGraph} />;
};

export default NetworkVisualizerGraph;
