import React, { useEffect, useState } from "react";

import Sidebar from "../components/project-components/Sidebar";
import Navbar from "../components/project-components/Navbar";
import TabBar from "../components/project-components/TabBar";
import MainScene from "../components/project-components/MainScene";

import PlotsContainer from "../components/project-components/plots/PlotsContainer";

import { selectTab } from "state/reducers/selectedTabSlice";
import { useSelector } from "react-redux";

import "assets/ProjectPage.css";

import { Item } from "../models/Item";
import { useParams } from "react-router-dom";
import { Storage } from "aws-amplify";
import { useAppDispatch, useAppSelector } from "state/hooks";
import {
  selectSimulationProperties,
  updateSimulationProperties,
} from "state/reducers/simulationPropertiesSlice";
import { selectUsername } from "state/reducers/authSlice";
import { useQuery } from "@tanstack/react-query";

function Project() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [scene, setScene] = useState<BABYLON.Scene>();
  const [isResultTabSelected, setIsResultTabSelected] = useState(false);
  const [version, setVersion] = useState("v1");
  const [projectName, setProjectName] = useState("");
  const simulationProperties = useAppSelector(selectSimulationProperties);
  const dispatch = useAppDispatch();

  const { selectedTab } = useSelector(selectTab);
  const currentUsername = useAppSelector(selectUsername);

  const { projectId } = useParams();

  useEffect(() => {
    if (projectName === "") {
      document.title = `blit.ai • The #1 cloud-based RF simulation platform`;
    } else {
      document.title = `${projectName} | blit.ai`;
    }
  }, [projectName]);

  useEffect(() => {
    selectedTab === 2
      ? setIsResultTabSelected(true)
      : setIsResultTabSelected(false);
  }, [selectedTab]);

  const getProjectInfo = async (
    projectId?: string,
    currentUsername?: string
  ) => {
    if (projectId && projectId !== null && projectId !== "") {
      const infoData = await Storage.get(
        `${currentUsername}/projects/${projectId}/info.json`,
        {
          download: true,
          cacheControl: "no-cache",
        }
      );
      if (infoData.Body) {
        const dataBody: any = infoData.Body;
        const dataString = await dataBody.text();
        const json = JSON.parse(dataString);
        return json;
      }
    }
  };

  const getSimulationProperties = async (
    projectId?: string,
    version?: string,
    currentUsername?: string
  ) => {
    if (
      projectId &&
      projectId !== null &&
      projectId !== "" &&
      version &&
      version !== null &&
      version !== "" &&
      currentUsername &&
      currentUsername !== null &&
      currentUsername !== ""
    ) {
      const propertiesData = await Storage.get(
        `${currentUsername}/projects/${projectId}/${version}/properties.json`,
        { download: true, cacheControl: "no-cache" }
      );
      if (propertiesData.Body) {
        const dataBody: any = propertiesData.Body;
        const dataString = await dataBody.text();
        const json = JSON.parse(dataString);
        return json;
      }
    }
  };

  useQuery({
    queryKey: ["projectData", projectId, currentUsername],
    queryFn: async () => {
      let data: any = {};
      if (
        projectId &&
        projectId !== null &&
        projectId !== "" &&
        currentUsername &&
        currentUsername !== null &&
        currentUsername !== ""
      ) {
        data = await getProjectInfo(projectId, currentUsername);
      }
      return data;
    },
    onSuccess: (data) => {
      setProjectName(data.project_name);
      setVersion(data.latestVersion);
    },
    onError: (err) => {
      console.log(err);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useQuery({
    queryKey: ["simulationPropertiesData", projectId, currentUsername, version],
    queryFn: async () => {
      let data: any = {};
      if (
        projectId &&
        projectId !== null &&
        projectId !== "" &&
        version &&
        version !== null &&
        version !== "" &&
        currentUsername &&
        currentUsername !== null &&
        currentUsername !== ""
      ) {
        data = await getSimulationProperties(
          projectId,
          version,
          currentUsername
        );
      }
      return data;
    },
    onSuccess: (data) => {
      dispatch(
        updateSimulationProperties({
          ...simulationProperties,
          ...data,
        })
      );
    },
    onError: (err) => {
      console.log(err);
    },
    retry: 1,
    refetchOnWindowFocus: true,
  });

  function getScene(mainScene: BABYLON.Scene) {
    setScene(mainScene);
  }

  return (
    <div className="flex w-fill h-screen ">
      {scene && (
        <div
          id="sidebar-container"
          className="md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between md:w-[30rem] z-10"
        >
          <Sidebar
            scene={scene}
            items={items}
            selectedItems={selectedItems}
            setItems={setItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
      )}

      <div className="flex-col overflow-x-auto h-screen w-full">
        {/* <div className=""> */}
        {scene && (
          <Navbar
            scene={scene}
            projectName={projectName}
            projectId={projectId ?? ""}
            version={version}
          />
        )}
        {/* </div> */}

        {scene && (
          <div className="tab-bar">
            <TabBar
              objects={items}
              selectedObjects={selectedItems}
              setObjects={setItems}
              setSelectedObjects={setSelectedItems}
            />
          </div>
        )}

        <div className={isResultTabSelected ? "hidden" : ""}>
          <MainScene
            objects={items}
            setObjects={setItems}
            getScene={getScene}
          />
        </div>
        {projectId && (
          <div
            //style={{ height: "100%" }}
            className={!isResultTabSelected ? "hidden" : ""}
          >
            <PlotsContainer projectId={projectId} version={version} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Project;
