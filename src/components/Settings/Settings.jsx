import React, { useState, useContext } from "react";
import {
  Button,
  FloatButton,
  message,
  Popover,
  Upload,
  Switch,
  Flex,
  Radio,
  Divider,
} from "antd";
import {
  FileAddOutlined,
  SettingOutlined,
  UploadOutlined,
  VerticalAlignMiddleOutlined,
} from "@ant-design/icons";
import { MainContext } from "../../contexts/MainContext";
import {
  curveStyles,
  mapGraphDataToCytoscape,
} from "../../helpers/commonHelpers";

const UPLOAD_TITLE = "Upload JSON";
const SETTINGS_TITLE = "Settings";

const Settings = () => {
  const [open, setOpen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [file, setFile] = useState(null);

  const {
    setCytoscapeGraph,
    appSettings,
    setAppSettings,
    setZoomLevel,
    addMolecule,
    updateCytoscapeGraph,
  } = useContext(MainContext);

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleOpenSettingsChange = (newOpen) => {
    setOpenSettings(newOpen);
  };

  const props = {
    beforeUpload: (file) => {
      const isJSON = file.type === "application/json";
      if (!isJSON) {
        message.error(`${file.name} is not a JSON file`);
      }
      return isJSON || Upload.LIST_IGNORE;
    },
  };

  const handleUpload = async (file) => {
    if (!file) return; // No file selected, do nothing

    const fileContent = await readFileContent(file);

    try {
      // parse JSON file content
      const data = JSON.parse(fileContent);

      // map data to networkGraph
      const mappedData = mapGraphDataToCytoscape(data);

      // render graph via context
      setCytoscapeGraph(mappedData);

      // populate molecules if any
      mappedData.forEach((graphElement) => {
        if (!!graphElement.data.svg) {
          const molId = graphElement.data.id;
          const svgUrl = graphElement.data.svg;
          addMolecule({ [molId]: svgUrl });
          updateCytoscapeGraph(molId, svgUrl);
        }
      });

      setFile(null); // Clear the file after successful upload
      setOpen(false); // Close the popover
    } catch (error) {
      message.error("Invalid JSON file or graph format");
    }
  };

  const handleChange = async (info) => {
    const fileList = [...info.fileList]; // Copy the file list to avoid mutation

    // Set the file if a file is selected
    if (fileList.length > 0) {
      const selectedFile = fileList[fileList.length - 1].originFileObj;
      setFile(selectedFile);
      await handleUpload(selectedFile);
    } else {
      // Clear file if the file list is empty
      setFile(null);
    }
  };

  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result); // Resolve with the file content
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  return (
    <FloatButton.Group
      shape="circle"
      style={{
        right: 24,
      }}
    >
      <FloatButton
        icon={<VerticalAlignMiddleOutlined />}
        type="primary"
        tooltip="Fit to screen"
        onClick={() => setZoomLevel(Math.random())} // reset zoom level which will trigger the fit to screen in rendering component
      />
      <Popover
        content={
          <Upload
            onChange={handleChange}
            beforeUpload={props.beforeUpload}
            fileList={file ? [file] : []} // Display the selected file, if any
          >
            <Button icon={<UploadOutlined />}>Select JSON file</Button>
          </Upload>
        }
        title={UPLOAD_TITLE}
        trigger="click"
        open={open}
        placement="leftBottom"
        onOpenChange={handleOpenChange}
      >
        <FloatButton
          icon={<FileAddOutlined />}
          type="primary"
          tooltip={!open && <div>{UPLOAD_TITLE}</div>}
        />
      </Popover>
      <Popover
        content={
          <Flex gap="middle" vertical>
            <Flex gap="middle">
              <div>Show structures inside the nodes</div>
              <Switch
                value={appSettings.showStructures}
                onChange={(checked) => {
                  // update context setting
                  setAppSettings({ ...appSettings, showStructures: checked });

                  // if disabled - remove all custom nodes
                  setCytoscapeGraph((prev) =>
                    prev.map((node) => {
                      if (node.data.nodeType === "substance") {
                        node.data.type = checked ? "custom" : "";
                      }
                      return node;
                    })
                  );
                }}
              />
            </Flex>
            <Divider style={{ margin: 0 }} />
            <Flex gap="middle">
              <div>Set edge style:</div>
              <Radio.Group
                onChange={(e) =>
                  setAppSettings({
                    ...appSettings,
                    edgeCurveStyle: e.target.value,
                  })
                }
                value={appSettings.edgeCurveStyle}
              >
                <Radio value={curveStyles.STRAIGHT}>Straight</Radio>
                <Radio value={curveStyles.BEZIER}>Bezier</Radio>
                <Radio value={curveStyles.SEGMENTS}>Segments</Radio>
              </Radio.Group>
            </Flex>
          </Flex>
        }
        title={SETTINGS_TITLE}
        trigger="click"
        open={openSettings}
        placement="leftBottom"
        onOpenChange={handleOpenSettingsChange}
      >
        <FloatButton
          icon={<SettingOutlined />}
          type="primary"
          tooltip={<div>Settings</div>}
        />
      </Popover>
    </FloatButton.Group>
  );
};

export { Settings };
