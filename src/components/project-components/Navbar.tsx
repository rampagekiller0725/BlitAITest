import React, { useState, useEffect } from "react";
import MyIcon from "assets/MyIcons";
import { scene } from "./MainScene";
import { Auth, Storage } from "aws-amplify";
import api from "services/api";
import { useAppSelector } from "state/hooks";
import { selectModels } from "state/reducers/modelSlice";
import { selectSimulationProperties } from "state/reducers/simulationPropertiesSlice";
import Materials from "../../components/project-components/babylonjs/types/materials";
import { selectGeneratedMesh } from "state/reducers/generatedMeshSlice";
import { selectUsername } from "state/reducers/authSlice";
import { v4 as uuid } from "uuid";

interface NavbarProps {
  scene: BABYLON.Scene;
  projectName: string;
  projectId: string;
  version: string;
}

function Navbar({ scene, projectName, projectId, version }: NavbarProps) {
  const username = useAppSelector(selectUsername);
  const models = useAppSelector(selectModels);
  const modelsToDraw = Object.values(models);
  const arrayModel = modelsToDraw.flat() as any[];
  const simulationProperties = useAppSelector(selectSimulationProperties);
  const [materials, setMaterials] = useState<Materials | null>(null);
  const generatedMesh = useAppSelector(selectGeneratedMesh);
  const currentUser = useAppSelector(selectUsername);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [portsDefined, setPortsDefined] = useState(false);
  const [meshDefined, setMeshDefined] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Storage.get(`${username}/materials.json`, {
        download: true,
        cacheControl: "no-cache",
      });
      const dataBody: any = data.Body;
      const dataString = await dataBody.text();
      const json = JSON.parse(dataString);

      setMaterials(json);
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    const portsExist = arrayModel.some((model) => model.category === "Ports");
    setPortsDefined(portsExist);
  }, [arrayModel]);

  useEffect(() => {
    const meshExist = generatedMesh !== undefined;
    setMeshDefined(meshExist);
  }, [arrayModel]);

  useEffect(() => {
    const checkStatusInterval = setInterval(async () => {
      const statusData = await getStatus();

      const validStatus = [
        "Initializing compute",
        "Starting simulation",
        "Running | Energy",
        "Post-processing results",
        "Preparing",
        "Processing",
      ];
      if (validStatus.some((status) => statusData.status?.includes(status))) {
        setIsSimulationRunning(true);
      } else {
        setIsSimulationRunning(false);
      }
    }, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(checkStatusInterval);
  }, []);

  const getStatus = async () => {
    try {
      const data = await Storage.get(
        `${username}/projects/${projectId}/info.json`,
        {
          download: true,
          cacheControl: "no-cache",
        }
      );
      if (data.Body) {
        const dataBody: any = data.Body;
        const dataString = await dataBody.text();
        const json = JSON.parse(dataString);
        return json;
      }
    } catch (err) {
      return {};
    }
  };

  const saveBabylonToS3 = async () => {
    if (scene) {
      const sceneData = BABYLON.SceneSerializer.Serialize(scene);
      await Storage.put(
        `${currentUser}/projects/${projectId}/${version}/model.json`,
        sceneData,
        {
          contentType: "application/json",
        }
      );
    }
  };

  const stopSimulation = async () => {
    setIsSimulationRunning(true);
    setIsLoading(true);
    const response = await api.post("/run_simulation", {
      projectId,
      stop_simulation: 1,
    });
    setIsLoading(false);
    setIsSimulationRunning(false);
  };

  const startSimulation = async () => {
    setIsLoading(true);
    let geometry: any = {};
    let ports: any = {};
    let elements: any = {};
    arrayModel.forEach((model) => {
      if (model.category === "Objects") {
        const mesh = scene.getMeshById(model.id);
        if (mesh !== null) {
          let meshString = BABYLON.STLExport.CreateSTL(
            [mesh as BABYLON.Mesh],
            false,
            mesh.id
          );

          const lines = meshString.split("\n");
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line.startsWith("\t\t\tvertex")) {
              const components = line.split(" ");
              const y = components[2];
              const z = components[3];
              components[2] = z;
              components[3] = y;
              lines[i] = components.join(" ");
            }
          }

          meshString = lines.join("\n");
          if (materials) {
            geometry[model.name + "_" + uuid()] = {
              shape: window.btoa(meshString),
              material: {
                epsilon: materials[model.material]?.epsilon,
                kappa: materials[model.material]?.kappa,
                mu: materials[model.material]?.mu,
              },
            };
          }
        }
      } else if (model.category === "Ports") {
        ports[model.name.split(" ")[1]] = {
          start: [
            parseFloat(model.object.x.min),
            parseFloat(model.object.y.min),
            parseFloat(model.object.z.min),
          ],
          stop: [
            parseFloat(model.object.x.max),
            parseFloat(model.object.y.max),
            parseFloat(model.object.z.max),
          ],
          impedance: parseFloat(model.object.impedance),
          amplitude: parseFloat(model.object.amplitude),
          phase_shift: parseFloat(model.object.phase_shift),
          f_ref: parseFloat(model.object.f_ref),
        };
      } else if (model.category === "Lumped Elements") {
        elements[model.name.split(" ")[1]] = {
          start: [
            parseFloat(model.object.x.min),
            parseFloat(model.object.y.min),
            parseFloat(model.object.z.min),
          ],
          stop: [
            parseFloat(model.object.x.max),
            parseFloat(model.object.y.max),
            parseFloat(model.object.z.max),
          ],
          element_type: model.object.element_type,
          resistance: parseFloat(model.object.resistance),
          inductance: parseFloat(model.object.inductance),
          capacitance: parseFloat(model.object.capacitance),
        };
      }
    });
    const data = {
      geometry: geometry,
      mesh: generatedMesh,
      simulation: {
        ...simulationProperties,
        ports: ports,
        elements: elements,
      },
    };
    await Storage.put(`${currentUser}/projects/${projectId}/case.json`, data, {
      contentType: "application/json",
    });
    const response = await api.post("/run_simulation", { projectId });
    setIsLoading(false);
    setIsSimulationRunning(true);
    const interval = setInterval(async () => {
      const status = await getStatus();
      if (status.percentage === 100) {
        clearInterval(interval);
        setIsSimulationRunning(false);
      }
    }, 1000);
  };

  return (
    <nav className="font-inter bg-white py-3">
      <div className="flex justify-between px-2">
        {/* Return to "My Projects Screen" Or " My Dashbord" */}
        <div className="flex align-middle">
          <span className="ml-4 my-auto flex items-center justify-center w-6 h-6 rounded focus:outline-none">
            <MyIcon name="back-home" />
          </span>
          <span className="my-auto text-gray-300 flex mx-4 items-center justify-center w-2 h-2 rounded focus:outline-none">
            <MyIcon name="right-arrow" color="#D0D5DD" />
          </span>
          <button
            className="my-auto px-0 py-1 text-[#475467] font-medium bg-white text-sm flex items-center justify-center rounded focus:outline-none"
            onClick={() => window.open("/projects")}
          >
            Projects
          </button>
          <span className="my-auto text-gray-300 flex mx-4 items-center justify-center w-2 h-2 rounded focus:outline-none">
            <MyIcon name="right-arrow" color="#D0D5DD" />
          </span>
          <span className="my-auto px-2 py-1 flex font-semibold text-[#344054] text-sm items-center bg-[#F9FAFB] justify-center rounded focus:outline-none">
            {projectName ? projectName : "-"}
          </span>
        </div>

        <div>
          <div className="flex justify-between px-2">
            {/* Return to "My Projects Screen" Or " My Dashbord" */}
            <div className="flex align-middle">
              <button
                className="my-auto px-2 py-1 flex font-semibold text-[#344054] text-sm items-center bg-[#F9FAFB] justify-center rounded focus:outline-none"
                onClick={(e) => saveBabylonToS3()}
              >
                Save project
              </button>
            </div>
          </div>
        </div>

        {/* Help - Start Simulation */}
        <div>
          <div className="flex gap-2">
            <div className="shadow-sm flex align-middle border-2 border-[#D0D5DD] rounded-md">
              <div className="ml-2 mr-1 my-auto">
                <MyIcon name="search" />
              </div>
              <input
                type="text"
                className="my-auto mr-1 px-2 py-1 text-sm flex items-center justify-center focus:outline-none placeholder-[#667085]"
                placeholder="Help"
              />
            </div>
            <button
              className={`relative shadow-sm mx-2 my-auto px-3 py-2 font-medium text-sm flex items-center justify-center align-middle rounded-md focus:outline-none text-white ${
                isLoading ||
                (!isSimulationRunning && (!portsDefined || !meshDefined))
                  ? "bg-primary-300"
                  : isSimulationRunning
                  ? "bg-error-600 hover:bg-error-700 active:bg-error-800 hover:transition duration-150 shadow-lg hover:shadow-error-600/50"
                  : "bg-primary-600 hover:bg-primary-700 active:bg-primary-900 hover:transition duration-150 shadow-lg hover:shadow-primary-600/50"
              }`}
              onClick={(e) =>
                isSimulationRunning ? stopSimulation() : startSimulation()
              }
              disabled={
                isLoading ||
                ((!portsDefined || !meshDefined) && !isSimulationRunning)
              }
            >
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  isLoading ? "flex" : "hidden"
                }`}
              >
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white inline-block"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
              <div
                className={`absolute inset-0 flex items-center justify-center ${
                  isLoading ? "hidden" : "flex"
                }`}
              >
                <MyIcon
                  name={
                    isSimulationRunning ? "stop-simulation" : "start-simulation"
                  }
                />
                <span>
                  {isSimulationRunning ? "Stop simulation" : "Start simulation"}
                </span>
              </div>
              <div className="flex items-center justify-center opacity-0">
                <MyIcon
                  name={
                    isSimulationRunning ? "stop-simulation" : "start-simulation"
                  }
                />
                <span>
                  {isSimulationRunning ? "Stop simulation" : "Start simulation"}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
