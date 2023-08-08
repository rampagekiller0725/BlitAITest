import React, { useEffect, useState } from "react";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import ModelingTab from "./tabbar/ModelingTab";
import MeshTab from "./tabbar/MeshTab";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { updateSelectedTab } from "state/reducers/selectedTabSlice";
import ResultTab from "./tabbar/ResultTab";
import { selectProjectInfo } from "state/reducers/projectInfoSlice";
import { scene } from "./MainScene";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export interface TabBarProps {
  objects: any[];
  selectedObjects: any[];
  setObjects: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedObjects: React.Dispatch<React.SetStateAction<any[]>>;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 1.5 }}>
          <Typography component={"div"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const TabBar = ({
  objects,
  setObjects,
  selectedObjects,
  setSelectedObjects,
}: TabBarProps) => {
  const [value, setValue] = React.useState(0);
  const dispatch = useAppDispatch();
  const [isResultAvailable, setIsResultAvailable] = useState(false);
  const projectInfo = useAppSelector(selectProjectInfo);

  useEffect(() => {
    const validStatus = [
      "Running | Energy",
      "Post-processing results",
      "Preparing",
      "Processing",
      "Completed",
      "Terminated",
    ];
    if (
      validStatus.some((status) => projectInfo?.info?.status?.includes(status))
    ) {
      setIsResultAvailable(true);
    } else {
      setIsResultAvailable(false);
    }
  }, [projectInfo.info.status]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    dispatch(updateSelectedTab(newValue));
  };

  return (
    <div className="">
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            variant="fullWidth"
            className="tabs"
          >
            <Tab label="Modeling" {...a11yProps(0)} />
            <Tab label="Mesh" {...a11yProps(1)} />
            <Tab
              label="Results"
              {...a11yProps(2)}
              disabled={!isResultAvailable}
              sx={
                isResultAvailable
                  ? { opacity: 1, pointerEvents: "auto" }
                  : { opacity: 0.4, pointerEvents: "none" }
              }
            />
          </Tabs>
        </Box>
        <div className="overflow-x-auto p-0">
          <TabPanel value={value} index={0}>
            <ModelingTab
              projectId=""
              objects={objects}
              selectedObjects={selectedObjects}
              setObjects={setObjects}
              setSelectedObjects={setSelectedObjects}
              mainScene={scene}
            />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <MeshTab mainScene={scene} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <ResultTab />
          </TabPanel>
        </div>
      </Box>
    </div>
  );
};

export default TabBar;
// export { selectedTabId };
