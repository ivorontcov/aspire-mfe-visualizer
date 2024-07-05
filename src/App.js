import React, { useState } from "react";
import { MainContext } from "./contexts/MainContext";
import {
  defaultAppSettings,
  defaultGraphSettings,
  graphLayouts,
  views,
} from "./helpers/commonHelpers";
import NetworkVisualizer from "./views/NetworkVisualizer";
import Sandbox from "./views/Sandbox";
import CyVisualizer from "./views/Cytoscape";

function App() {
  const [selectedView, setSelectedView] = useState(views.CYTOSCAPE);
  const [appSettings, setAppSettings] = useState(defaultAppSettings);
  const [graphSettings, setGraphSettings] = useState(defaultGraphSettings);
  const [networkGraph, setNetworkGraph] = useState(null);
  const [cytoscapeGraph, setCytoscapeGraph] = useState([]);
  const [layout, setLayout] = useState(graphLayouts.FORCE_DIRECTED);
  const [molecules, setMolecules] = useState({});
  const [zoomLevel, setZoomLevel] = useState();

  const viewsMap = {
    [views.NETWORK_VISUALIZER]: <NetworkVisualizer />,
    [views.GRAPH_SANDBOX]: <Sandbox />,
    [views.CYTOSCAPE]: <CyVisualizer />,
  };

  const addMolecule = (molecule) => {
    setMolecules((prev) => ({
      ...prev,
      ...molecule,
    }));
  };

  const updateCytoscapeGraph = (molId, molSvg) => {
    setCytoscapeGraph((prev) => {
      const newGraph = prev.map((node) => {
        if (node.data.id === molId) {
          return {
            data: {
              ...node.data,
              type: "custom",
              svg: molSvg,
            },
          };
        }
        return node;
      });

      return newGraph;
    });
  };

  const ViewComponent = viewsMap[selectedView];

  return (
    <MainContext.Provider
      value={{
        selectedView,
        setSelectedView,
        appSettings,
        setAppSettings,
        graphSettings,
        setGraphSettings,
        networkGraph,
        setNetworkGraph,
        cytoscapeGraph,
        setCytoscapeGraph,
        layout,
        setLayout,
        molecules,
        setMolecules,
        addMolecule,
        updateCytoscapeGraph,
        zoomLevel,
        setZoomLevel,
      }}
    >
      {ViewComponent}
    </MainContext.Provider>
  );
}

export default App;
