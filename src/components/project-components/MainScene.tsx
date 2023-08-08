import React, { useState, useEffect } from "react";
import * as BABYLON from "babylonjs";
import "babylonjs-loaders";
import { GridMaterial } from "babylonjs-materials";
import "./MainScene.css";
import { selectUsername } from "state/reducers/authSlice";
import { Storage } from "aws-amplify";

import {
  setFirstSelected,
  selectModels,
  modelCompleted,
  modelRemovedFromScene,
  modelAltered,
} from "state/reducers/modelSlice";

import { createBabylonScene } from "./babylonjs/Scenes/BabylonScene";
import { createAxisViewScene } from "./babylonjs/Scenes/AxisViewScene";
import { useAppDispatch, useAppSelector } from "state/hooks";
import Materials from "./babylonjs/types/materials";
import ParametersBar from "./ParametersBar";
import FooterBar from "./FooterBar";
import { selectParameters } from "state/reducers/parametersSlice";
import { calculate } from "utilities";
import { selectTab } from "state/reducers/selectedTabSlice";
import {
  isSceneClickable,
  setSceneClickable,
  setPickedPos,
} from "state/reducers/sceneSlice";
import { getVertices } from "utilities";
import { resourceLimits } from "worker_threads";

let scene: BABYLON.Scene;

interface MainSceneProps {
  getScene: Function;
  setObjects: React.Dispatch<React.SetStateAction<any[]>>;
  objects: any[];
}

function MainScene({ getScene, setObjects, objects }: MainSceneProps) {
  const [canvas, setCanvas] = useState<HTMLCanvasElement>();
  const [engine, setEngine] = useState<BABYLON.Engine>();
  const [mainScene, setMainScene] = useState<BABYLON.Scene>();
  const [axisViewScene, setAxisViewScene] = useState<BABYLON.Scene>();
  const [materials, setMaterials] = useState<Materials | null>(null);

  var cam: any = undefined;

  if (mainScene) {
    scene = mainScene;
  }

  const dispatch = useAppDispatch();
  const username = useAppSelector(selectUsername);
  var sceneClickable = useAppSelector(isSceneClickable);

  var sphere: any;
  var offset = 1.5;

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

  const models = useAppSelector(selectModels);
  const parameters = useAppSelector(selectParameters);
  const tabIndex = useAppSelector(selectTab);

  useEffect(() => {
    setCanvas(document.querySelectorAll("canvas")[0]);
  }, []);

  useEffect(() => {
    if (canvas) {
      // canvas.style.height = "inherit";
      canvas.style.background = "rgb(185, 190, 205)";
      canvas.style.background =
        "linear-gradient(180deg, rgb(185, 190, 205) 0%, rgba(255, 255, 255) 100%)";

      setEngine(
        new BABYLON.Engine(canvas, true, {
          disableWebGL2Support: false,
          preserveDrawingBuffer: false,
        })
      );
    }
  }, [canvas]);

  var [flag, setFlag] = useState(false);
  useEffect(() => {
    if (
      document.getElementById("sidebar-container")?.clientWidth &&
      canvas &&
      !flag
    ) {
      let sideBarWidth: any =
        document.getElementById("sidebar-container")?.clientWidth;
      let parameterBarHeight: any =
        document.getElementsByClassName("parameters-bar")[0]?.clientHeight;
      let navHeight: any =
        document.getElementsByTagName("nav")[0]?.clientHeight;
      let tabHeight: any =
        document.getElementsByClassName("tab-bar")[0]?.clientHeight;
      setFlag(true);
      engine?.setSize(
        canvas?.width - sideBarWidth,
        canvas?.height - parameterBarHeight - navHeight - tabHeight
      );
    }
  });

  useEffect(() => {
    if (canvas && engine) {
      engine.disablePerformanceMonitorInBackground = true;
      engine.enableOfflineSupport = false;
      engine.doNotHandleContextLost = false;
      engine.loadingUIBackgroundColor = "#000000e1";

      setMainScene(createBabylonScene(canvas, engine));
      setAxisViewScene(createAxisViewScene(canvas, engine));
    }
  }, [engine, canvas]);

  const makeClickResponse = (mesh: any) => {
    mesh.actionManager = new BABYLON.ActionManager(mainScene);
    mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOverTrigger,
        function (m) {
          if (m.meshUnderPointer?.material)
            m.meshUnderPointer.material.alpha = 1;
        }
      )
    );

    mesh.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPointerOutTrigger,
        function (m) {
          if (m.meshUnderPointer?.material)
            m.meshUnderPointer.material.alpha = 0;
        }
      )
    );
  };

  var createFacePoints = function () {
    var mat = new BABYLON.StandardMaterial("material", mainScene);
    mat.emissiveColor = new BABYLON.Color3(1, 0, 0);
    mat.alpha = 0;

    sphere = BABYLON.MeshBuilder.CreateSphere(
      "sphere1",
      { diameter: offset, segments: 16 },
      mainScene
    );
    sphere.material = mat;
    makeClickResponse(sphere);
  };

  var removeFacePoints = function () {
    mainScene?.meshes.forEach(function (mesh) {
      if (mesh.name.indexOf("sphere") != -1) {
        if (mesh.parent) {
          mesh.parent = null;
        }
        mesh.dispose();
      }
    });
  };

  useEffect(() => {
    const handleDoubleClick = (event: MouseEvent) => {
      event.preventDefault();
      if (mainScene && !sceneClickable) {
        let ray = mainScene.createPickingRay(
          mainScene.pointerX,
          mainScene.pointerY,
          null,
          mainScene.activeCamera
        );
        let result = mainScene.pickWithRay(ray);

        const model = models.find((m) => m.id === result?.pickedMesh?.id);

        if (model && model.visible) {
          const selectedModel = {
            ...model,
            status: "Altered",
            selected: true,
          };
          dispatch(modelAltered(selectedModel));
          dispatch(setFirstSelected(result?.pickedMesh?.id));
        }

        if (!event.ctrlKey && !event.metaKey) {
          const updatedModels = models
            .filter((m) => m.id !== model?.id)
            .map((m) => ({
              ...m,
              status: "Altered",
              selected: false,
            }));
          updatedModels.forEach((m) => dispatch(modelAltered(m)));
        }
      }
    };

    if (canvas && mainScene) {
      canvas.addEventListener("dblclick", handleDoubleClick);
      return () => {
        canvas.removeEventListener("dblclick", handleDoubleClick);
      };
    }
  }, [canvas, mainScene, models, sceneClickable]);

  useEffect(() => {
    const handleDoubleClick = (event: MouseEvent) => {
      event.preventDefault();
      if (mainScene) {
        let ray = mainScene.createPickingRay(
          mainScene.pointerX,
          mainScene.pointerY,
          null,
          mainScene.activeCamera
        );
        let result = mainScene.pickWithRay(ray);

        const model = models.find((m) => m.id === result?.pickedMesh?.id);

        if (model && model.visible) {
          const selectedModel = {
            ...model,
            status: "Altered",
            selected: true,
          };
          dispatch(modelAltered(selectedModel));
          dispatch(setFirstSelected(result?.pickedMesh?.id));
        }

        if (!event.ctrlKey && !event.metaKey) {
          const updatedModels = models
            .filter((m) => m.id !== model?.id)
            .map((m) => ({
              ...m,
              status: "Altered",
              selected: false,
            }));
          updatedModels.forEach((m) => dispatch(modelAltered(m)));
        }
      }
    };

    if (canvas && mainScene) {
      canvas.addEventListener("dblclick", handleDoubleClick);
      return () => {
        canvas.removeEventListener("dblclick", handleDoubleClick);
      };
    }
  }, [canvas, mainScene, models]);

  useEffect(() => {
    if (canvas && engine && mainScene) {
      getScene(mainScene);
      let groundMaterial = new GridMaterial("groundMaterial", mainScene);
      groundMaterial.majorUnitFrequency = 5;
      groundMaterial.minorUnitVisibility = 0.5;
      groundMaterial.gridRatio = 2;
      groundMaterial.opacity = 0.99;
      groundMaterial.useMaxLine = true;
      groundMaterial.lineColor = new BABYLON.Color3(
        135 / 255,
        135 / 255,
        135 / 255
      );
      groundMaterial.backFaceCulling = false;
      let ground = BABYLON.MeshBuilder.CreateGround(
        "ground",
        { width: 100, height: 100, updatable: false },
        mainScene
      );

      // Rotate ground to the XY plane
      ground.rotation.x = Math.PI / 2;

      ground.material = groundMaterial;
      ground.material.zOffset = 1;
      mainScene.render();
    }
    //eslint-disable-next-line
  }, [canvas, engine, mainScene]);

  const euclideanDistance3D = (pos1: any, pos2: any) => {
    if (pos2 == undefined) {
      return 1e9;
    }

    let dx = pos2.x - pos1.x;
    let dy = pos2.y - pos1.y;
    let dz = pos2.z - pos1.z;

    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  useEffect(() => {
    if (mainScene) {
      if (sceneClickable) createFacePoints();
      else removeFacePoints();
      canvas?.addEventListener("pointermove", (e) => {
        e.preventDefault();
        if (models.length == 0) return;
        if (sceneClickable == false) return;

        sphere.isVisible = false;

        var vertInfo;

        var result = mainScene?.pick(mainScene.pointerX, mainScene.pointerY);
        if (result?.hit && result.pickedMesh?.id != "sphere1") {
          vertInfo = getVertices(result.pickedMesh);
          if (vertInfo && result.pickedPoint) {
            let closestVertex;
            let closestDistance = Infinity;
            for (var i = 0; i < vertInfo.global.length; i++) {
              let dist = euclideanDistance3D(
                result.pickedPoint,
                vertInfo.global[i]
              );
              if (dist < closestDistance) {
                closestDistance = dist;
                closestVertex = vertInfo.global[i];
              }
            }
            if (closestVertex) {
              if (sphere) {
                let modifiedVertex = new BABYLON.Vector3(
                  closestVertex.x + 1,
                  closestVertex.y + 1,
                  closestVertex.z + 1
                );

                // Handle potential null case for activeCamera
                if (mainScene.activeCamera) {
                  // Create immutable vectors for the distance calculation
                  let cameraPos = new BABYLON.Vector3(
                    mainScene.activeCamera.position.x,
                    mainScene.activeCamera.position.y,
                    mainScene.activeCamera.position.z
                  );
                  let vertexPos = new BABYLON.Vector3(
                    closestVertex.x,
                    closestVertex.y,
                    closestVertex.z
                  );

                  // Get the distance between the camera and the sphere
                  let cameraDistance = BABYLON.Vector3.Distance(
                    cameraPos,
                    vertexPos
                  );

                  // Decide on a factor to scale the sphere by - you can adjust this to fit your needs
                  let scaleFactor = cameraDistance / 100;

                  sphere.scaling = new BABYLON.Vector3(
                    euclideanDistance3D(closestVertex, modifiedVertex) *
                      scaleFactor,
                    euclideanDistance3D(closestVertex, modifiedVertex) *
                      scaleFactor,
                    euclideanDistance3D(closestVertex, modifiedVertex) *
                      scaleFactor
                  );

                  sphere.isVisible = true;
                  sphere.position = closestVertex;
                }
              }
            }
          }
        }
      });

      canvas?.addEventListener("dblclick", (event) => {
        event.preventDefault();
        if (sceneClickable && mainScene) {
          let ray = mainScene?.createPickingRay(
            mainScene.pointerX,
            mainScene.pointerY,
            null,
            mainScene.activeCamera
          );
          let result = mainScene?.pickWithRay(ray);

          if (sphere?.isVisible) {
            dispatch(
              setPickedPos({
                x: sphere.position._x,
                y: sphere.position._y,
                z: sphere.position._z,
              })
            );
            return;
          }
        }
      });
      mainScene?.render();
    }
  }, [sceneClickable]);

  useEffect(() => {
    if (canvas && engine && mainScene && axisViewScene) {
      engine.runRenderLoop(function () {
        mainScene.render();
        axisViewScene.render();
        if (axisViewScene.activeCamera && mainScene.activeCamera) {
          // mainScene.activeCamera.attachControl(canvas);
          let camera = mainScene.activeCamera as BABYLON.ArcRotateCamera;
          let axisViewCamera =
            axisViewScene.activeCamera as BABYLON.ArcRotateCamera;
          axisViewCamera.alpha = camera.alpha;
          axisViewCamera.beta = camera.beta;
          mainScene.autoClear = true;
        }
      });

      window.addEventListener("resize", () => {
        engine.resize();
      });
    }
  }, [canvas, engine, mainScene, axisViewScene]);

  const setPortMeshColor = (alteredMesh: BABYLON.AbstractMesh, model: any) => {
    if (alteredMesh instanceof BABYLON.LinesMesh) {
      const linesMesh = alteredMesh as BABYLON.LinesMesh;
      if (model.type === "port") {
        linesMesh.color = BABYLON.Color3.FromHexString("#00008B");
      } else if (model.type === "element") {
        linesMesh.color = BABYLON.Color3.FromHexString("#008D00");
      }
    }
  };
  // add models that are stored and not in scene
  useEffect(() => {
    if (canvas && engine && mainScene && axisViewScene && models) {
      const modelsToDraw = Object.values(models);

      const arrayModel = modelsToDraw.flat();
      arrayModel.forEach((model: any) => {
        if (model.status === "Added") {
          const modelType = model.type;
          const objectToCreate = {
            id: model.id,
            name: model.name,
            material: model.material,
            ...model.object,
          };
          addShape(modelType, objectToCreate);
          // alter the state to completed
          dispatch(modelCompleted(model.id));
        }
        if (model.status === "Altered") {
          const alteredMesh = mainScene.getMeshById(model.id);
          if (!alteredMesh) {
            return;
          }
          if (model.type !== "port" && model.type !== "element") {
            alteredMesh.material = getMaterial(model.material);
            alteredMesh.material.zOffset = 0.5;
          }
          if (model.visible) {
            setPortMeshColor(alteredMesh, model);
            if (model.selected) {
              alteredMesh.visibility = 1;
              alteredMesh.showBoundingBox = true;
            } else {
              alteredMesh.visibility = 0.5;
              alteredMesh.showBoundingBox = false;
            }
          } else {
            alteredMesh.showBoundingBox = false;
            alteredMesh.visibility = 0;
          }
          dispatch(modelCompleted(model.id));
        }
        if (model.status === "Updated") {
          let mesh = mainScene.getMeshById(model.id);
          if (mesh) mesh.dispose();
          const modelType = model.type;
          const objectToCreate = {
            id: model.id,
            name: model.name,
            material: model.material,
            ...model.object,
          };
          addShape(modelType, objectToCreate);
          dispatch(modelCompleted(model.id));
        }
        if (model.status === "Removed") {
          const deletedMesh = mainScene.getMeshById(model.id);
          if (deletedMesh) {
            deletedMesh.dispose();
          }
          dispatch(modelRemovedFromScene(model.id));
        }
        const selectedCount = arrayModel.filter(
          (model: any) => model.selected
        ).length;
        if (selectedCount === 0) {
          for (let model of arrayModel) {
            const mesh = mainScene.getMeshById(model.id);
            if (mesh) {
              if (model.visible) {
                mesh.visibility = 1;
                mesh.isPickable = true;
              } else {
                mesh.visibility = 0;
                mesh.isPickable = false;
              }
              mesh.showBoundingBox = false;
            }
          }
        }
      });
    }
    //eslint-disable-next-line
  }, [canvas, engine, mainScene, axisViewScene, models, parameters]);

  const getMaterial = (color: any) => {
    if (!materials) {
      return new BABYLON.StandardMaterial("PEC", scene);
    }
    const material = Object.keys(materials).find(
      (material) => material === color
    );
    if (material) {
      const meshMaterial = new BABYLON.StandardMaterial(material, scene);
      meshMaterial.diffuseColor = BABYLON.Color3.FromHexString(
        materials[material].color
      );
      return meshMaterial;
    }
    const meshMaterial = new BABYLON.StandardMaterial("PEC", scene);
    meshMaterial.diffuseColor = BABYLON.Color3.FromHexString(
      materials["PEC"].color
    );
    return meshMaterial;
  };

  const addShape = (type: string, obj: any) => {
    if (type === "cube") {
      let mesh = BABYLON.MeshBuilder.CreateBox(obj.name, {}, mainScene);

      mesh.scaling.x =
        calculate(obj.xMax, parameters) - calculate(obj.xMin, parameters);
      mesh.scaling.y =
        calculate(obj.yMax, parameters) - calculate(obj.yMin, parameters);
      mesh.scaling.z =
        calculate(obj.zMax, parameters) - calculate(obj.zMin, parameters);
      mesh.position.x =
        (parseFloat(calculate(obj.xMax, parameters)) +
          parseFloat(calculate(obj.xMin, parameters))) /
        2;
      mesh.position.y =
        (parseFloat(calculate(obj.yMax, parameters)) +
          parseFloat(calculate(obj.yMin, parameters))) /
        2;
      mesh.position.z =
        (parseFloat(calculate(obj.zMax, parameters)) +
          parseFloat(calculate(obj.zMin, parameters))) /
        2;
      mesh.id = obj.id;
      mesh.material = getMaterial(obj.material);
      mesh.material.zOffset = 0.5;
    } else if (type === "sphere") {
      let mesh = BABYLON.MeshBuilder.CreateSphere(
        obj.name,
        {
          segments: calculate(obj.segments, parameters),
          diameter: calculate(obj.diameter, parameters),
          diameterX: calculate(obj.diameterX, parameters),
          diameterY: calculate(obj.diameterY, parameters),
          diameterZ: calculate(obj.diameterZ, parameters),
        },
        mainScene
      );
      mesh.id = obj.id;
      mesh.material = getMaterial(obj.material);
      mesh.material.zOffset = 0.5;
    } else if (type === "cylinder") {
      let mesh = BABYLON.MeshBuilder.CreateCylinder(
        obj.name,
        {
          height: calculate(obj.height, parameters),
          diameter: calculate(obj.diameter, parameters),
          diameterTop: calculate(obj.topDiameter, parameters),
          diameterBottom: calculate(obj.bottomDiameter, parameters),
          tessellation: calculate(obj.tesselation, parameters),
          subdivisions: calculate(obj.subdivisions, parameters),
        },
        mainScene
      );
      mesh.id = obj.id;
      mesh.material = getMaterial(obj.material);
      mesh.material.zOffset = 0.5;
    } else if (type === "port") {
      let mesh = BABYLON.MeshBuilder.CreateLines(
        obj.name,
        {
          points: [
            new BABYLON.Vector3(
              calculate(obj.x.min, parameters),
              calculate(obj.y.min, parameters),
              calculate(obj.z.min, parameters)
            ),
            new BABYLON.Vector3(
              calculate(obj.x.max, parameters),
              calculate(obj.y.max, parameters),
              calculate(obj.z.max, parameters)
            ),
          ],
        },
        mainScene
      );
      mesh.color = BABYLON.Color3.FromHexString("#00008B");
      mesh.id = obj.id;
      // mesh.material = getMaterial(obj.material);
    } else if (type === "element") {
      let mesh = BABYLON.MeshBuilder.CreateLines(
        obj.name,
        {
          points: [
            new BABYLON.Vector3(
              calculate(obj.x.min, parameters),
              calculate(obj.y.min, parameters),
              calculate(obj.z.min, parameters)
            ),
            new BABYLON.Vector3(
              calculate(obj.x.max, parameters),
              calculate(obj.y.max, parameters),
              calculate(obj.z.max, parameters)
            ),
          ],
        },
        mainScene
      );
      mesh.color = BABYLON.Color3.FromHexString("#008D00");
      mesh.id = obj.id;
      // mesh.material = getMaterial(obj.material);
    }
  };
  // Add the models which are not shown in the canvas yet

  return (
    <div
      className="relative w-full h-full border-t-2 border-[#EAECF0]"
      id="canvas"
    >
      <canvas className="focus:outline-none w-full" id="renderCanvas"></canvas>
      {tabIndex.selectedTab == 0 && <ParametersBar />}
      {tabIndex.selectedTab == 1 && <FooterBar />}
    </div>
  );
}

export default MainScene;
export { scene };
