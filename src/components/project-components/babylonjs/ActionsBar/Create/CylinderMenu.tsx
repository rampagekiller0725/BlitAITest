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

export interface CylinderProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  isEditableModal?: boolean;
  modelToBeAlter?: any;
}

function CylinderMenu({
  visible,
  setVisible,
  isEditableModal,
  modelToBeAlter,
}: CylinderProps) {
  const [name, setName] = useState("Cylinder");
  const [diameter, setDiameter] = useState("1");
  const [height, setHeight] = useState("1");
  const [topDiameter, setTopDiameter] = useState("1");
  const [bottomDiameter, setBottomDiameter] = useState("1");
  const [tesselation, setTesselation] = useState("32");
  const [subdivisions, setSubdivisions] = useState("1");
  const [material, setMaterial] = useState("PEC");
  const [materials, setMaterials] = useState<Materials | null>(null);
  const username = useAppSelector(selectUsername);

  const dispatch = useAppDispatch();
  const parameters = useAppSelector(selectParameters);

  document.addEventListener("keydown", (event) => {
    if (visible) {
      if (event.key == "Escape") setVisible(false);
      else if (event.key == "Enter")
        document.getElementById("cylinder-ok-btn")?.click();
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
      setHeight(modelToBeAlter.object.height);
      setTopDiameter(modelToBeAlter.object.topDiameter);
      setBottomDiameter(modelToBeAlter.object.bottomDiameter);
      setTesselation(modelToBeAlter.object.tesselation);
      setSubdivisions(modelToBeAlter.object.subdivisions);
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
      case "height":
        setHeight(e.target.value);
        break;
      case "topDiameter":
        setTopDiameter(e.target.value);
        break;
      case "bottomDiameter":
        setBottomDiameter(e.target.value);
        break;
      case "tesselation":
        setTesselation(e.target.value);
        break;
      case "subdivisions":
        setSubdivisions(e.target.value);
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
        type: "cylinder",
        object: {
          diameter: diameter,
          topDiameter: topDiameter,
          bottomDiameter: bottomDiameter,
          height: height,
          tesselation: tesselation,
          subdivisions: subdivisions,
        },
        status: "Added",
        category: "Objects",
        visible: true,
        selected: false,
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
          Cylinder
        </h1>
      }
      visible={visible}
      buttons={
        <div className="flex flex-row gap-1 justify-center">
          <button
            onClick={handleOk}
            id="cylinder-ok-btn"
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
              htmlFor="height"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Height
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="height"
                value={height}
                onChange={handleChanges}
                id="height"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="topDiameter"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Top Diameter
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="topDiameter"
                value={topDiameter}
                onChange={handleChanges}
                id="topDiameter"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="bottomDiameter"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Bottom Diameter
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="bottomDiameter"
                value={bottomDiameter}
                onChange={handleChanges}
                id="bottomDiameter"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="tesselation"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Tesselation
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="tesselation"
                value={tesselation}
                onChange={handleChanges}
                id="tesselation"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="subdivisions"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Subdivisions
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="subdivisions"
                value={subdivisions}
                onChange={handleChanges}
                id="subdivisions"
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

export default CylinderMenu;
