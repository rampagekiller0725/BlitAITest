import { useState, useEffect } from "react";
import { scene } from "components/project-components/MainScene";
import { Storage } from "aws-amplify";
import * as BABYLON from "babylonjs";
import Materials from "../../types/materials";

import { useAppDispatch, useAppSelector } from "state/hooks";
import { selectModels } from "state/reducers/modelSlice";
import DraggableModal from "components/DraggableModal";
import { selectSimulationProperties } from "state/reducers/simulationPropertiesSlice";
import {
  setMesh,
  setMeshXY,
  setMeshXZ,
  setMeshYZ,
} from "state/reducers/generatedMeshSlice";
import { selectGeneratedMeshXY } from "state/reducers/generatedMeshSlice";
import { selectUsername } from "state/reducers/authSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectGeneratedMesh } from "state/reducers/generatedMeshSlice";

export interface EditXYProps {
  setVisible: (value: boolean) => void;
  visible: boolean;
}

function EditXYMenu({ visible, setVisible }: EditXYProps) {
  const [XY, setXY] = useState("");
  const models = useAppSelector(selectModels);
  const modelsToDraw = Object.values(models);
  const arrayModel = modelsToDraw.flat() as any[];
  const [materials, setMaterials] = useState<Materials | null>(null);
  const simulationProperties = useAppSelector(selectSimulationProperties);
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectUsername);
  const generatedMeshXY = useAppSelector(selectGeneratedMeshXY);
  let currentMesh = useSelector(selectGeneratedMesh);

  document.addEventListener("keydown", (event) => {
    if(visible) {
      if(event.key == 'Escape') 
        document.getElementById('editxy-btn-cancel')?.click();
      else if(event.key == "Enter")
        document.getElementById('editxy-btn-ok')?.click();
    }
  });

  useEffect(() => {
    if (visible) {
      if (generatedMeshXY.length != 0) setXY(generatedMeshXY.toString());
    }
  }, [visible]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Storage.get(`${currentUser}/materials.json`, {
        download: true,
        cacheControl: "no-cache",
      });
      const dataBody: any = data.Body;
      const dataString = await dataBody.text();
      const json = JSON.parse(dataString);
      setMaterials(json);
    };

    fetchData();
  }, [currentUser]);

  const handleChanges = (e: any) => {
    switch (e.target.name) {
      case "XY":
        setXY(e.target.value);
        break;
    }
  };

  const getArray = (data: string) => {
    // Check if data is a string
    if (typeof data !== "string") {
      alert("Input must be a string");
      return [];
    }

    // Split string into array and remove leading/trailing spaces
    let array = data.split(",").map((item) => item.trim());

    // Parse string elements to float and filter out non-numeric values
    let floatArray = array
      .map((item) => parseFloat(item))
      .filter((item) => !isNaN(item));

    // Remove duplicates
    floatArray = Array.from(new Set(floatArray));

    // Sort array
    floatArray.sort((a, b) => a - b);

    // Check if any NaN values exist after sorting
    if (floatArray.some(isNaN)) {
      alert("Input string contains non-numeric values");
      return [];
    }

    return floatArray;
  };

  const applyMesh = (isCancel: boolean, previewOnly: boolean = false) => {
    if (!isCancel && getArray(XY).length < 20) {
      alert("Each axis/plane must consist of at least 20 mesh lines.");
      return 1;
    }
    if (arrayModel.length > 0) {
      arrayModel.forEach((model) => {
        const mesh = scene.getMeshById(model.id);
        if (mesh !== null) {
          for (let i = 0; i < 100; i++) {
            scene.meshes.forEach(function (mesh) {
              if (mesh.name === "_meshLines") {
                if (mesh.parent) {
                  mesh.parent = null;
                }
                mesh.dispose();
              }
            });
          }
        }
      });

      const x = currentMesh.x;
      const y = currentMesh.y;
      const z = isCancel ? currentMesh.z : getArray(XY);

      if (!previewOnly) {
        dispatch(setMeshXY(z));
        dispatch(setMeshYZ(x));
        dispatch(setMeshXZ(y));
        dispatch(
          setMesh({
            x: x,
            y: y,
            z: z,
          })
        );
      }

      // Primary mesh lines
      for (let i = 0; i < x.length; i++) {
        let lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLines",
          {
            points: [
              new BABYLON.Vector3(x[i], y[0], z[0]),
              new BABYLON.Vector3(x[i], y[0], z[z.length - 1]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
        lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLines",
          {
            points: [
              new BABYLON.Vector3(x[i], y[0], z[0]),
              new BABYLON.Vector3(x[i], y[y.length - 1], z[0]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
      }
      for (let i = 0; i < y.length; i++) {
        let lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLines",
          {
            points: [
              new BABYLON.Vector3(x[0], y[i], z[0]),
              new BABYLON.Vector3(x[0], y[i], z[z.length - 1]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
        lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLines",
          {
            points: [
              new BABYLON.Vector3(x[0], y[i], z[0]),
              new BABYLON.Vector3(x[x.length - 1], y[i], z[0]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
      }
      for (let i = 0; i < z.length; i++) {
        let lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLines",
          {
            points: [
              new BABYLON.Vector3(x[0], y[0], z[i]),
              new BABYLON.Vector3(x[0], y[y.length - 1], z[i]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
        lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLines",
          {
            points: [
              new BABYLON.Vector3(x[0], y[0], z[i]),
              new BABYLON.Vector3(x[x.length - 1], y[0], z[i]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
      }

      // Secondary mesh lines
      for (let i = 0; i < x.length; i++) {
        let lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLinesSecondary",
          {
            points: [
              new BABYLON.Vector3(x[i], y[y.length - 1], z[0]),
              new BABYLON.Vector3(x[i], y[y.length - 1], z[z.length - 1]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
        lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLinesSecondary",
          {
            points: [
              new BABYLON.Vector3(x[i], y[0], z[z.length - 1]),
              new BABYLON.Vector3(x[i], y[y.length - 1], z[z.length - 1]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
      }
      for (let i = 0; i < y.length; i++) {
        let lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLinesSecondary",
          {
            points: [
              new BABYLON.Vector3(x[x.length - 1], y[i], z[0]),
              new BABYLON.Vector3(x[x.length - 1], y[i], z[z.length - 1]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
        lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLinesSecondary",
          {
            points: [
              new BABYLON.Vector3(x[0], y[i], z[z.length - 1]),
              new BABYLON.Vector3(x[x.length - 1], y[i], z[z.length - 1]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
      }
      for (let i = 0; i < z.length; i++) {
        let lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLinesSecondary",
          {
            points: [
              new BABYLON.Vector3(x[x.length - 1], y[0], z[i]),
              new BABYLON.Vector3(x[x.length - 1], y[y.length - 1], z[i]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
        lines = BABYLON.MeshBuilder.CreateLines(
          "_meshLinesSecondary",
          {
            points: [
              new BABYLON.Vector3(x[0], y[y.length - 1], z[i]),
              new BABYLON.Vector3(x[x.length - 1], y[y.length - 1], z[i]),
            ],
          },
          scene
        );
        lines.color = new BABYLON.Color3(1, 0, 0);
      }

      // Hide secondary mesh lines
      scene.meshes.forEach((mesh: any) => {
        if (mesh.name === "_meshLinesSecondary") {
          mesh.visibility = 0;
        }
      });
    }
    return 0;
  };

  const handleOk = (e: any) => {
    if (applyMesh(false) === 0) setVisible(false);
  };

  return (
    <DraggableModal
      title={
        <h1 className="bg-green-300 w-full text-xl font-semibold rounded-t-md py-2 text-center border-b-2 border-indigo-600">
          Edit XY
        </h1>
      }
      visible={visible}
      buttons={
        <div className="flex flex-row gap-1 justify-center">
          <button
            onClick={handleOk}
            id="editxy-btn-ok"
            className="bg-green-300 hover:bg-green-400 rounded text-center ml-32 px-4 py-1 disable-drag"
          >
            OK
          </button>
          <button
            onClick={() => applyMesh(false, true)}
            className="bg-blue-300 hover:bg-blue-400 rounded text-center px-4 py-1 disable-drag"
          >
            Preview
          </button>
          <button
            onClick={(e) => {
              setVisible(false);
              applyMesh(true);
            }}
            id="editxy-btn-cancel"
            className="bg-red-300 hover:bg-red-400 rounded text-center mr-32 px-4 py-1 disable-drag"
          >
            Cancel
          </button>
        </div>
      }
    >
      <form>
        <div className="mt-4 grid grid-cols-20 gap-x-6 gap-y-4">
          <div className="col-span-full">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Comma-separated list of mesh lines for the XY plane (z-axis):
            </label>
            <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-indigo-600 disable-drag">
              <textarea
                name="XY"
                value={XY}
                onChange={handleChanges}
                id="XY"
                autoComplete="off"
                rows={10}
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm max-w-full ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
        </div>
      </form>
      {}
    </DraggableModal>
  );
}

export default EditXYMenu;
