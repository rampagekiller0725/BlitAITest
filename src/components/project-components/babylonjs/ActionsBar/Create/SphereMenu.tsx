import * as React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { modelAdded, modelAltered } from "state/reducers/modelSlice";
import Materials from "../../types/materials";
import { MaterialSelectOptions } from "components/project-components/MaterialSelectOptions";
import DraggableModal from "components/DraggableModal";
import { v4 as uuid } from "uuid";
import { selectParameters } from "state/reducers/parametersSlice";
import { selectUsername } from "state/reducers/authSlice";
import { Storage } from "aws-amplify";

export interface SphereProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  isEditableModal?: boolean;
  modelToBeAlter?: any;
}

function SphereMenu({
  visible,
  setVisible,
  isEditableModal,
  modelToBeAlter,
}: SphereProps) {
  const [name, setName] = useState("Sphere");
  const [diameter, setDiameter] = useState("1");
  const [diameterX, setDiameterX] = useState("1");
  const [diameterY, setDiameterY] = useState("1");
  const [diameterZ, setDiameterZ] = useState("1");
  const [segments, setSegments] = useState("32");
  const [material, setMaterial] = useState("PEC");
  const [materials, setMaterials] = useState<Materials | null>(null);
  const username = useAppSelector(selectUsername);

  const dispatch = useAppDispatch();
  const parameters = useAppSelector(selectParameters);

  document.addEventListener("keydown", (event) => {
    if (visible) {
      if (event.key == "Escape") setVisible(false);
      else if (event.key == "Enter")
        document.getElementById("sphere-ok-btn")?.click();
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
      setDiameter(modelToBeAlter.object.diameter);
      setDiameterX(modelToBeAlter.object.diameterX);
      setDiameterY(modelToBeAlter.object.diameterY);
      setDiameterZ(modelToBeAlter.object.diameterZ);
      setSegments(modelToBeAlter.object.segments);
      setMaterial(modelToBeAlter.material);
    }
  }, [isEditableModal, visible]);

  const handleChanges = (e: any) => {
    switch (e.target.name) {
      case "name":
        setName(e.target.value);
        break;
      case "diameter":
        setDiameter(e.target.value);
        break;
      case "diameterX":
        setDiameterX(e.target.value);
        break;
      case "diameterY":
        setDiameterY(e.target.value);
        break;
      case "diameterZ":
        setDiameterZ(e.target.value);
        break;
      case "segments":
        setSegments(e.target.value);
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
        type: "sphere",
        object: {
          name: name,
          diameter: diameter,
          diameterX: diameterX,
          diameterY: diameterY,
          diameterZ: diameterZ,
          segments: segments,
        },
        status: "Added",
        category: "Objects",
        visible: true,
        material: material,
        position: {
          x: 0,
          y: 0,
          z: 0,
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

  return (
    <DraggableModal
      title={
        <h1 className="bg-green-300 w-full text-xl font-semibold rounded-t-md py-2 text-center border-b-2 border-indigo-600">
          Sphere
        </h1>
      }
      visible={visible}
      buttons={
        <div className="flex flex-row gap-1 justify-center">
          <button
            onClick={handleOk}
            id="sphere-ok-btn"
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
              htmlFor="diameter"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Diameter
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="diameter"
                value={diameter}
                onChange={handleChanges}
                id="diameter"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="diameterX"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Diameter X
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="diameterX"
                value={diameterX}
                onChange={handleChanges}
                id="diameterX"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="diameterY"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Diameter Y
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="diameterY"
                value={diameterY}
                onChange={handleChanges}
                id="diameterY"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="diameterZ"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Diameter Z
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="diameterZ"
                value={diameterZ}
                onChange={handleChanges}
                id="diameterZ"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="segments"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Tesselation
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="segments"
                value={segments}
                onChange={handleChanges}
                id="segments"
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
    </DraggableModal>
  );
}

export default SphereMenu;
