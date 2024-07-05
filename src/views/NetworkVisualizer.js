import React, { useEffect, useContext } from "react";
import { io } from "socket.io-client";
import BaseLayout from "./BaseLayout";
import NetworkVisualizerGraph from "./NetworkVisualizerGraph";
import { MainContext } from "../contexts/MainContext";
import { mapGraphData } from "../helpers/commonHelpers";

function NetworkVisualizer() {
  const WS_URL = process.env.REACT_APP_WEBSOCKET_URL || "http://localhost:3001";
  const socket = io(WS_URL);

  // context
  const { setNetworkGraph, appSettings, setAppSettings } = useContext(MainContext);

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("join_room", {
        user: "network-visualizer-ui",
        room: appSettings.roomId,
      });
      console.log(`Connected to ${WS_URL}. Room ID: ${appSettings.roomId}`);
    });

    socket.on("receive_message", (data) => {
      console.log(`===== WS Message =====`);
      console.log("Raw data object received from WebSocket Server:");
      console.dir(data);

      // map data to networkGraph
      const mappedData = mapGraphData(data.message);

      setNetworkGraph(mappedData);
    });

    // Listen for a response from the server
    socket.on("join_error", (err) => {
      console.error("Server error:", err);
      setAppSettings({ ...appSettings, joinRoomError: `${err.error} (${appSettings.roomId}). Please, use another roomId or generate unique one in the app settings.` });
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
      <NetworkVisualizerGraph />
    </BaseLayout>
  );
}

export default NetworkVisualizer;
