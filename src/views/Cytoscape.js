import React, { useEffect, useContext } from "react";
import { io } from "socket.io-client";
import BaseLayout from "./BaseLayout";
import CytoscapeGraph from "./CytoscapeGraph";
import { MainContext } from "../contexts/MainContext";
import {
  generateRoomId,
  getFlatIds,
  mapGraphDataToCytoscape,
  requestOptions,
} from "../helpers/commonHelpers";

function Cytoscape() {
  const WS_URL = process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:3001";
  const socket = io(WS_URL);

  // context
  const {
    setCytoscapeGraph,
    appSettings,
    setAppSettings,
    molecules,
    addMolecule,
    updateCytoscapeGraph,
  } = useContext(MainContext);

  useEffect(() => {
    socket.on("connect", () => {
      // generate new room id
      const roomId = generateRoomId();

      // set roomId in appSettings
      setAppSettings({
        ...appSettings,
        roomId,
      });

      // join room event
      socket.emit("join_room", {
        user: "aspire-network-visualizer",
        room: roomId,
      });

      console.log(`Connected to ${WS_URL}. Room ID: ${roomId}`);
    });

    socket.on("receive_message", (data) => {
      // map data to networkGraph
      const mappedData = mapGraphDataToCytoscape(data.message);

      setCytoscapeGraph(mappedData);

      /*
      
        Fetch SVG images for molecules and reactions logic

      */
     
      // we need to skip fetching in standalone mode
      if (!appSettings.isStandaloneMode) {
        // create flat array of inchikeys and reactions
        const idsFlat = getFlatIds(mappedData);

        // Create an array of Promises for each API call
        const apiCalls = idsFlat.map((molId) => {
          // only fetch if the molecule is not already in the state (prevent extra requests)
          if (!molecules.hasOwnProperty(molId)) {
            const isReaction = molId.startsWith("ASPR");
            const rxUrl = `${appSettings.apiUrl}/rxid_svg?rxid=${molId}&highlight=true&width=1200&height=400`;
            const subUrl = `${appSettings.apiUrl}/substance_inchikey_svg?inchikey=${molId}&width=300&height=300`;
            const finalUrl = isReaction ? rxUrl : subUrl;

            return fetch(finalUrl, requestOptions)
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`Failed to fetch item ${molId}`);
                }
                return response.blob(); // Convert response to blob
              })
              .then((blob) => {
                // Handle the response, e.g., display the SVG image
                const svgUrl = URL.createObjectURL(blob);

                // Use the SVG URL as needed (e.g., setting it as the source of an <img> tag)
                addMolecule({ [molId]: svgUrl });

                // for cutsom nodes that not reactions - we need to update the state with the svg
                if (!isReaction) {
                  updateCytoscapeGraph(molId, svgUrl);
                }
              })
              .catch((error) => {
                console.error(error);
                addMolecule({ [molId]: null });
                return null;
              });
          }
          return null;
        });

        // Execute all API calls concurrently using Promise.all
        Promise.all(apiCalls)
          .then((results) => {
            // Handle the array of results here
            console.log(
              `Depiction of ${results.length} molecules complete successfully.`
            );
          })
          .catch((error) => {
            console.error("Error while fetching molecule images:", error);
          });
      }
    });

    // Listen for a response from the server
    socket.on("join_error", (err) => {
      console.error("Server error:", err);

      // generate new Room ID and try to re-connect
      const newRoomId = generateRoomId();

      setAppSettings({
        ...appSettings,
        joinRoomError: `${err.error} (${appSettings.roomId}). Please, use another roomId or refresh the page to generate a random.`,
        roomId: newRoomId,
      });

      socket.emit("join_room", {
        user: "aspire-network-visualizer",
        room: newRoomId,
      });
    });

    return () => {
      socket.off("connect");
      socket.off("receive_message");
      socket.off("join_error");
      console.log("Disconnected from WebSocket Server");
    };
  }, []);

  return (
    <BaseLayout>
      <CytoscapeGraph />
    </BaseLayout>
  );
}

export default Cytoscape;
