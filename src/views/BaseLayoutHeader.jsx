import React, { useContext } from "react";
import { Button, Flex } from "antd";
import { MainContext } from "../contexts/MainContext";
import { graphLayouts } from "../helpers/commonHelpers";
import RoomId from "../components/RoomId";

const BaseLayoutHeader = () => {
  const { layout, setLayout } = useContext(MainContext);

  return (
    <Flex justify="space-between" align="center" style={{ padding: "10px", paddingRight: "20px" }}>
      <Flex gap="middle" wrap="wrap">
        <Button
          type={layout === graphLayouts.FORCE_DIRECTED && "primary"}
          onClick={() => setLayout(graphLayouts.FORCE_DIRECTED)}
          size="small"
        >
          Force-directed
        </Button>
        <Button
          type={layout === graphLayouts.HIERARCHICAL && "primary"}
          onClick={() => setLayout(graphLayouts.HIERARCHICAL)}
          size="small"
        >
          Hierarhical
        </Button>
      </Flex>
      <RoomId />
    </Flex>
  );
};

export default BaseLayoutHeader;
