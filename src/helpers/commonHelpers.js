import { v4 as uuidv4 } from "uuid";

export const views = {
  GRAPH_SANDBOX: "Graph Sandbox",
  NETWORK_VISUALIZER: "Network Visualizer",
  CYTOSCAPE: "Cytoscape",
};

export const graphLayouts = {
  FORCE_DIRECTED: "cola",
  HIERARCHICAL: "dagre",
};

export const viewsList = [
  views.NETWORK_VISUALIZER,
  views.GRAPH_SANDBOX,
  views.CYTOSCAPE,
];

export const curveStyles = {
  STRAIGHT: "straight",
  BEZIER: "unbundled-bezier",
  SEGMENTS: "segments",
};

function removeTrailingSlashFromHostname(hostname) {
  if (hostname.endsWith("/")) {
    return hostname.slice(0, -1);
  } else {
    return hostname;
  }
}

export const generateRoomId = () => uuidv4();

export const defaultAppSettings = {
  roomId: generateRoomId(),
  graphSize: 50,
  apiUrl: removeTrailingSlashFromHostname(
    process.env.REACT_APP_API_URL || "http://localhost:5058"
  ),
  showStructures: true,
  isStandaloneMode: !!process.env.REACT_APP_IN_STANDALONE_MODE,
  edgeCurveStyle: curveStyles.STRAIGHT,
};

export const defaultGraphSettings = {
  linkDirectionalArrowLength: 3.5,
  linkDirectionalArrowRelPos: 1,
  linkCurvature: 0.25,
  nodeLabel: "inchikey",
};

export const genRandomTree = (N = 300, reverse = false) => {
  return {
    nodes: [...Array(N).keys()].map((i) => ({
      id: i,
      inchikey: "UCPYLLCMEDAXFR-UHFFFAOYSA-N",
    })),
    links: [...Array(N).keys()]
      .filter((id) => id)
      .map((id) => ({
        [reverse ? "target" : "source"]: id,
        [reverse ? "source" : "target"]: Math.round(Math.random() * (id - 1)),
      })),
  };
};

export const mapGraphData = (data) => {
  return {
    nodes: data.nodes.map((node) => ({
      id: node.node_label,
      inchikey: node.node_label,
    })),
    links: data.edges.map((edge) => ({
      source: edge.start_node,
      target: edge.end_node,
    })),
  };
};

export const mapGraphDataToCytoscape = (data) => {
  const nodes = data.nodes.map((node) => ({
    data: {
      id: node.node_label,
      inchikey: node.node_label,
      nodeType: node.node_type,
      srole: node.srole,
      svg: node.base64svg ? `data:image/svg+xml;base64,${node.base64svg}` : null
    },
  }));

  const edges = data.edges.map((edge) => ({
    data: {
      id: edge.uuid,
      source: edge.start_node,
      target: edge.end_node,
      edgeType: edge.edge_type,
      edgeLabel: edge.edge_label,
    },
  }));

  return [...nodes, ...edges];
};

// default layout options for cytoscape cola
export const cyOptions = {
  animate: true, // whether to show the layout as it's running
  refresh: 1, // number of ticks per frame; higher is faster but more jerky
  maxSimulationTime: 4000, // max length in ms to run the layout
  ungrabifyWhileSimulating: false, // so you can't drag nodes during layout
  fit: true, // on every layout reposition of nodes, fit the viewport
  padding: 30, // padding around the simulation
  boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  nodeDimensionsIncludeLabels: false, // whether labels should be included in determining the space used by a node

  // layout event callbacks
  ready: function () {}, // on layoutready
  stop: function () {}, // on layoutstop

  // positioning options
  randomize: false, // use random node positions at beginning of layout
  avoidOverlap: true, // if true, prevents overlap of node bounding boxes
  handleDisconnected: true, // if true, avoids disconnected components from overlapping
  convergenceThreshold: 0.01, // when the alpha value (system energy) falls below this value, the layout stops
  nodeSpacing: function (node) {
    return 10;
  }, // extra spacing around nodes
  flow: undefined, // use DAG/tree flow layout if specified, e.g. { axis: 'y', minSeparation: 30 }
  alignment: undefined, // relative alignment constraints on nodes, e.g. {vertical: [[{node: node1, offset: 0}, {node: node2, offset: 5}]], horizontal: [[{node: node3}, {node: node4}], [{node: node5}, {node: node6}]]}
  gapInequalities: undefined, // list of inequality constraints for the gap between the nodes, e.g. [{"axis":"y", "left":node1, "right":node2, "gap":25}]
  centerGraph: true, // adjusts the node positions initially to center the graph (pass false if you want to start the layout from the current position)

  // different methods of specifying edge length
  // each can be a constant numerical value or a function like `function( edge ){ return 2; }`
  edgeLength: undefined, // sets edge length directly in simulation
  edgeSymDiffLength: undefined, // symmetric diff edge length in simulation
  edgeJaccardLength: undefined, // jaccard edge length in simulation

  // iterations of cola algorithm; uses default values on undefined
  unconstrIter: undefined, // unconstrained initial layout iterations
  userConstIter: undefined, // initial layout iterations with user-specified constraints
  allConstIter: undefined, // initial layout iterations with all constraints including non-overlap

  // hierarchical related options
  rankDir: "BT", // 'TB' for top to bottom layout, 'BT' for bottom to top, 'LR' for left to right, 'RL' for right to left
  directed: true, // whether the tree is directed downwards (or edges can point in any direction if false)
};

export const cyStyles = [
  {
    selector: "node",
    style: {
      shape: "rectangle",
      label: "data(id)",
      "border-width": 1,
      "border-color": "#666",
      "font-size": "2px",
      "text-margin-y": "-5px",
    },
  },
  {
    selector: 'node[nodeType="reaction"]',
    style: {
      shape: "ellipse",
      "background-color": "#df6c83",
    },
  },
  {
    selector: 'node[srole="sm"]',
    style: {
      "background-color": "#d8c571",
    },
  },
  {
    selector: 'node[srole="im"]',
    style: {
      "background-color": "#aaa",
    },
  },
  {
    selector: 'node[srole="tm"]',
    style: {
      "background-color": "#4c8da6",
    },
  },
  {
    selector: 'node[type="custom"]',
    style: {
      "background-image": "data(svg)",
      "background-fit": "cover",
    },
  },
  {
    selector: 'node[type="custom"][srole="im"]',
    style: {
      "border-color": "#d91515",
    },
  },
  {
    selector: 'node[type="custom"][srole="sm"]',
    style: {
      "border-color": "#4ca822",
    },
  },
  {
    selector: 'node[type="custom"][srole="tm"]',
    style: {
      "border-color": "#1f4b89",
    },
  },
  {
    selector: "edge",
    style: {
      width: 2,
      "target-arrow-shape": "vee",
      "curve-style": "straight",
    },
  },
  {
    selector: "edge[edgeType = 'product_of']",
    style: {
      "line-color": "#ec7014",
      "target-arrow-color": "#ec7014",
    },
  },
  {
    selector: "edge[edgeType = 'reactant_of']",
    style: {
      "line-color": "#225ea8",
      "target-arrow-color": "#225ea8",
    },
  },
];

export const isDAG = (cy) => {
  let visited = {}; // Track visited nodes
  let recStack = {}; // Track nodes in the current recursion stack

  // Helper function to perform DFS, looking for cycles
  function dfs(node) {
    if (!visited[node.id()]) {
      visited[node.id()] = true;
      recStack[node.id()] = true;

      // Get successors of the node
      let neighbors = node.outgoers().nodes();

      for (let i = 0; i < neighbors.length; i++) {
        let neighbor = neighbors[i];
        if (!visited[neighbor.id()] && dfs(neighbor)) {
          return true; // Cycle found
        } else if (recStack[neighbor.id()]) {
          return true; // Cycle found
        }
      }
    }
    recStack[node.id()] = false; // Remove the node from recursion stack before backtrack
    return false; // No cycles found
  }

  // Iterate over all nodes to check for cycles, considering disconnected components
  for (let i = 0; i < cy.nodes().length; i++) {
    if (dfs(cy.nodes()[i])) {
      return false; // Graph is not a DAG
    }
  }
  return true; // No cycles detected, graph is a DAG
};

export const requestOptions = {
  method: "POST",
  headers: {
    Accept: "image/svg+xml",
  },
};

// create flat array of inchikeys and reactions
export const getFlatIds = (data) => {
  const flatArray = [];

  data.forEach((el) => {
    if (el.data.inchikey) {
      flatArray.push(el.data.inchikey);
    }
    if (el.data.rxid) {
      flatArray.push(el.data.rxid);
    }
  });

  return flatArray;
};

export const mapStylesToCytoscape = (styles, appSettings) => {
  // clone it to prevent mutation
  const _styles = [...styles];

  // find the edge style and update it based on current app settings
  const edgeStyle = _styles.find((style) => style.selector === "edge");

  // additional check to prevent error if edgeStyle is not found
  if (edgeStyle) {
    edgeStyle.style["curve-style"] = appSettings.edgeCurveStyle;
  }

  return _styles;
};
