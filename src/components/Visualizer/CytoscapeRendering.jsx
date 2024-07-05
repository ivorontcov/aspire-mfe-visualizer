import React, { useEffect, useRef, useContext, useState } from "react";
import { Popover } from "antd";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import dagre from "cytoscape-dagre";
import {
  cyOptions,
  cyStyles,
  graphLayouts,
  isDAG,
  mapStylesToCytoscape,
} from "../../helpers/commonHelpers";
import { MainContext } from "../../contexts/MainContext";
import MoleculeSvg from "./MoleculeSvg";

cytoscape.use(cola);
cytoscape.use(dagre);

const headerHeight = 45; // Height of the fixed header in pixels (adjust as needed)

const CytoscapeRendering = ({ graph, layout }) => {
  const cyRef = useRef(null);
  const { appSettings, setAppSettings, zoomLevel } = useContext(MainContext);
  const [popover, setPopover] = useState({
    visible: false,
    content: "",
    x: 0,
    y: 0,
    nodeId: null,
  });

  useEffect(() => {
    // update cytoscape styles based on app settings
    const style = mapStylesToCytoscape(cyStyles, appSettings);

    cyRef.current = cytoscape({
      container: document.getElementById("cy"),
      elements: graph,
      style,
    });

    // Binding mouseover and mouseout events
    cyRef.current.on("mouseover", "node", function (event) {
      const node = event.target;

      // Decide whether to show the popover or not
      let showPopover = false;

      // popover shows only for reactions and when settings for structures are enabled
      if (node.data("nodeType") === "reaction") {
        showPopover = true;
      } else if (!appSettings.showStructures) {
        showPopover = true;
      }

      if (showPopover) {
        // Get the position of the node
        const renderedPosition = node.renderedPosition();

        // Update popover state to show it
        setPopover({
          visible: true,
          content: <MoleculeSvg molId={node.id()} />,
          x: renderedPosition.x,
          y: renderedPosition.y,
          nodeId: node.id(),
        });
      }
    });

    cyRef.current.on("mouseout", "node", function () {
      // Hide popover when mouse leaves node
      setPopover({ ...popover, visible: false, content: null, nodeId: null });
    });

    // Cleanup function to unbind events when component unmounts
    return () => {
      if (cyRef.current) {
        cyRef.current.removeListener("mouseover");
        cyRef.current.removeListener("mouseout");
      }
    };
  }, [appSettings.showStructures, appSettings.edgeCurveStyle, graph]);

  useEffect(() => {
    if (cyRef.current) {
      cyRef.current.elements().remove();
      cyRef.current.add(graph);

      const notDAGError =
        graphLayouts.HIERARCHICAL === layout && !isDAG(cyRef.current)
          ? "The graph is not a DAG, switching to force-directed layout is recommended"
          : null;

      setAppSettings({
        ...appSettings,
        notDAGError,
      });

      cyRef.current.layout({ name: layout, ...cyOptions }).run(); // we have to apply layout right before the run, otherwise it won't work (check `isHeadless` issue)
      cyRef.current.resize();
    }
  }, [graph, layout]);

  useEffect(() => {
    const cy = cyRef.current;
    const viewportHeight = window.innerHeight - headerHeight;
    const cyContainer = cy.container();
    cyContainer.style.height = `${viewportHeight}px`; // Set height of graph container

    // Center graph vertically within the available height
    const graphHeight = cyContainer.clientHeight;
    const yOffset = (viewportHeight - graphHeight) / 2;
    cy.panBy({ x: 0, y: yOffset }); // Pan the graph vertically

    // Optionally, trigger a redraw of the graph after adjustments
    cy.resize();
    cy.fit();
  }, [headerHeight, zoomLevel]);

  const handleVisibleChange = (visible) => {
    setPopover({ ...popover, visible });
  };

  return (
    <>
      <div id="cy" style={{ width: "100%", height: "100vh" }} />
      <Popover
        content={popover.content}
        open={popover.visible}
        onOpenChange={handleVisibleChange}
        title={popover.nodeId}
        placement="top"
        style={{
          position: "absolute",
          left: popover.x,
          top: popover.y,
          transform: "translate(-50%, -100%)",
        }}
      >
        {/* Invisible trigger for the Popover */}
        <div
          style={{
            position: "absolute",
            left: popover.x,
            top: popover.y,
            width: 1,
            height: 1,
          }}
        />
      </Popover>
    </>
  );
};

export default CytoscapeRendering;
