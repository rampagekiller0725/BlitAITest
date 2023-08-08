import * as React from "react";
import { useState, useEffect } from "react";
import Draggable from "react-draggable";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { Model, modelAdded, modelAltered } from "state/reducers/modelSlice";
import Materials from "../../types/materials";
import { MaterialSelectOptions } from "components/project-components/MaterialSelectOptions";
import DraggableModal from "components/DraggableModal";
import { v4 as uuid } from "uuid";
import { calculate } from "utilities";
import { selectParameters } from "state/reducers/parametersSlice";
import { selectUsername } from "state/reducers/authSlice";
import { Storage } from "aws-amplify";

export interface CubeProps {
  setVisible: (value: boolean) => void;
  visible: boolean;
  isEditableModal?: boolean;
  modelToBeAlter?: any;
}

function CubeMenu({
  visible,
  setVisible,
  isEditableModal,
  modelToBeAlter,
}: CubeProps) {
  const [name, setName] = useState("Cube");
  const [xMin, setXMin] = useState("");
  const [xMax, setXMax] = useState("");
  const [yMin, setYMin] = useState("");
  const [yMax, setYMax] = useState("");
  const [zMin, setZMin] = useState("");
  const [zMax, setZMax] = useState("");
  const [material, setMaterial] = useState("PEC");
  const [materials, setMaterials] = useState<Materials | null>(null);
  const username = useAppSelector(selectUsername);

  const dispatch = useAppDispatch();
  const parameters = useAppSelector(selectParameters);

  document.addEventListener("keydown", (event) => {
    if (visible) {
      if (event.key == "Escape") setVisible(false);
      else if (event.key == "Enter")
        document.getElementById("cube-ok-btn")?.click();
    }
  });

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
    if (isEditableModal != undefined && visible) {
      setName(modelToBeAlter.name);
      setXMin(modelToBeAlter.object.xMin);
      setXMax(modelToBeAlter.object.xMax);
      setYMin(modelToBeAlter.object.yMin);
      setYMax(modelToBeAlter.object.yMax);
      setZMin(modelToBeAlter.object.zMin);
      setZMax(modelToBeAlter.object.zMax);
      setMaterial(modelToBeAlter.material);
    }
  }, [isEditableModal, visible]);

  const handleChanges = (e: any) => {
    switch (e.target.name) {
      case "name":
        setName(e.target.value);
        break;
      case "xMin":
        setXMin(e.target.value);
        break;
      case "xMax":
        setXMax(e.target.value);
        break;
      case "yMin":
        setYMin(e.target.value);
        break;
      case "yMax":
        setYMax(e.target.value);
        break;
      case "zMin":
        setZMin(e.target.value);
        break;
      case "zMax":
        setZMax(e.target.value);
        break;
      case "material":
        setMaterial(e.target.value);
        break;
    }
  };

  const handleOk = (e: any) => {
    if (name === "") {
      alert("Object name cannot be empty.");
      return;
    }
    let model;
    try {
      model = {
        id: uuid(),
        name: name,
        type: "cube",
        object: {
          name: name,
          xMin: xMin,
          xMax: xMax,
          yMin: yMin,
          yMax: yMax,
          zMin: zMin,
          zMax: zMax,
        },
        material: material,
        status: "Added",
        category: "Objects",
        visible: true,
        selected: false,
        position: {
          x:
            (parseFloat(calculate(xMax, parameters).toString()) +
              parseFloat(calculate(xMin, parameters).toString())) /
            2,
          y:
            (parseFloat(calculate(yMax, parameters).toString()) +
              parseFloat(calculate(yMin, parameters).toString())) /
            2,
          z:
            (parseFloat(calculate(zMax, parameters).toString()) +
              parseFloat(calculate(zMin, parameters).toString())) /
            2,
        },
        rotation: {
          x: 0,
          y: 0,
          z: 0,
        },
        scaling: {
          x: 1,
          y: 1,
          z: 1,
        },
      };
    } catch (err) {
      alert("Invalid properties. Please try again.");
      return;
    }
    if (isEditableModal === undefined) {
      dispatch(modelAdded(model));
    } else {
      model.id = modelToBeAlter.id;
      model.status = "Updated";
      dispatch(modelAltered(model));
    }
    setVisible(false);
  };

  // const handleDrag = (e: any, ui: any) => {
  //   // restrict the menu from going out of the screen
  //   if (menuPosition.x < 0) {
  //     menuPosition.x = 0;
  //   }
  //   if (menuPosition.y < 0) {
  //     menuPosition.y = 0;
  //   }
  //   if (menuPosition.x > window.innerWidth - 500) {
  //     menuPosition.x = window.innerWidth - 500;
  //   }
  //   if (menuPosition.y > window.innerHeight - 500) {
  //     menuPosition.y = window.innerHeight - 500;
  //   }
  // };

  return (
    <DraggableModal
      title={
        <h1 className="bg-green-300 w-full text-xl font-semibold rounded-t-md py-2 text-center border-b-2 border-indigo-600">
          Cube
        </h1>
      }
      visible={visible}
      buttons={
        <div className="flex flex-row gap-1 justify-center">
          <button
            onClick={handleOk}
            id="cube-ok-btn"
            className="bg-green-300 hover:bg-green-400 rounded text-center px-4 py-1 disable-drag"
          >
            OK
          </button>
          <button
            onClick={(e) => setVisible(false)}
            className="bg-red-300 hover:bg-red-400 rounded text-center px-4 py-1 disable-drag"
          >
            Cancel
          </button>
        </div>
      }
    >
      <form>
        <div className="mt-4 grid grid-cols-12 gap-x-6 gap-y-4">
          <div className="col-span-full ">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChanges}
                id="name"
                autoComplete="off"
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="xMin"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              X Min
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="xMin"
                value={xMin}
                onChange={handleChanges}
                id="xMin"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="xMax"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              X Max
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="xMax"
                value={xMax}
                onChange={handleChanges}
                id="xMax"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="yMin"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Y Min
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="yMin"
                value={yMin}
                onChange={handleChanges}
                id="yMin"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="yMax"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Y Max
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="yMax"
                value={yMax}
                onChange={handleChanges}
                id="yMax"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="zMin"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Z Min
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="zMin"
                value={zMin}
                onChange={handleChanges}
                id="zMin"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="zMax"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Z Max
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="zMax"
                value={zMax}
                onChange={handleChanges}
                id="zMax"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-full ">
            <label
              htmlFor="material"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Material
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <select
                name="material"
                id="material"
                value={material}
                onChange={handleChanges}
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              >
                <MaterialSelectOptions options={materials ?? {}} />
              </select>
            </div>
          </div>
        </div>
      </form>
      {}
    </DraggableModal>
  );
}

export default CubeMenu;
