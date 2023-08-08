import * as React from "react";
import { useState, useEffect } from "react";
import * as BABYLON from "babylonjs";
import { Vector3 } from "babylonjs";
import { useAppSelector, useAppDispatch } from "state/hooks";
import {
  Model,
  selectModels,
  selectFirstSelected,
  modelAltered,
  setFirstSelected,
} from "state/reducers/modelSlice";
import DraggableModal from "components/DraggableModal";
import { calculate, isParameter } from "utilities";
import { selectParameters } from "state/reducers/parametersSlice";

export interface ScaleProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  mainScene: BABYLON.Scene | any;
}

function ScaleMenu({ visible, setVisible, mainScene }: ScaleProps) {
  const [xAxis, setXAxis] = useState("1");
  const [yAxis, setYAxis] = useState("1");
  const [zAxis, setZAxis] = useState("1");
  const [isScalingChanged, setIsScalingChanged] = useState(false);
  const [selectedModels, setSelectedModels] = useState<Model[]>([]);

  const models = useAppSelector(selectModels);
  const modelsToDraw = Object.values(models);
  const arrayModel = modelsToDraw.flat();
  const dispatch = useAppDispatch();
  const firstSelected: any = useAppSelector(selectFirstSelected);
  const parameters = useAppSelector(selectParameters);

  document.addEventListener("keydown", (event) => {
    if (visible) {
      if (event.key == "Escape")
        document.getElementById("scale-cancel-btn")?.click();
      else if (event.key == "Enter")
        document.getElementById("scale-ok-btn")?.click();
    }
  });

  const isMultipleSelected = () => {
    if (selectedModels.length <= 1) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    setSelectedModels(arrayModel.filter((model) => model.selected));
  }, []);

  useEffect(() => {
    if (isMultipleSelected()) {
      setXAxis("1");
      setYAxis("1");
      setZAxis("1");
    } else {
      let mesh = mainScene.getMeshById(firstSelected);
      if (mesh) {
        setXAxis("1");
        setYAxis("1");
        setZAxis("1");
      }
    }
  }, [visible]);

  // useEffect(() => {
  //   if (isScalingChanged && mainScene && mainScene !== null) {
  //     if (isMultipleSelected()) {
  //       const currentPosition = selectedModels.find(
  //         (model) => model.id === firstSelected
  //       )?.scaling;
  //       if (currentPosition) {
  //         try {
  //           selectedModels.map((model) => {
  //             const mesh = mainScene.getMeshById(model.id);
  //             if (mesh) {
  //               mesh.scaling = new Vector3(
  //                 model.scaling.x * calculate(xAxis, parameters),
  //                 model.scaling.y * calculate(yAxis, parameters),
  //                 model.scaling.z * calculate(zAxis, parameters)
  //               );
  //             }
  //           });
  //         } catch (err) {
  //           alert("please input correct value");
  //           return;
  //         }
  //       }
  //     } else {
  //       const mesh = mainScene.getMeshById(firstSelected);
  //       try {
  //         console.log(firstSelected);
  //         mesh.scaling = new Vector3(
  //           mesh.scaling.x * calculate(xAxis, parameters),
  //           mesh.scaling.y * calculate(yAxis, parameters),
  //           mesh.scaling.z * calculate(zAxis, parameters)
  //         );
  //       } catch (err) {
  //         alert("please input correct value");
  //         return;
  //       }
  //     }
  //     setIsScalingChanged(false);
  //   }
  // }, [xAxis, yAxis, zAxis, isScalingChanged]);

  const handleXAxisChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) setIsScalingChanged(true);
    setXAxis(e.target.value);
  };

  const handleYAxisChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) setIsScalingChanged(true);
    setYAxis(e.target.value);
  };

  const handleZAxisChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) setIsScalingChanged(true);
    setZAxis(e.target.value);
  };

  const handleOk = (e: any) => {
    if (isMultipleSelected()) {
      const models = selectedModels;
      try {
        models.map((model) => {
          dispatch(
            modelAltered({
              ...model,
              scaling: {
                x: model?.scaling?.x * calculate(xAxis, parameters),
                y: model?.scaling?.y * calculate(yAxis, parameters),
                z: model?.scaling?.z * calculate(zAxis, parameters),
              },
              selected: false,
            })
          );
        });

        selectedModels.map((model) => {
          const mesh = mainScene.getMeshById(model.id);
          if (mesh) {
            mesh.scaling = new Vector3(
              mesh.scaling.x * calculate(xAxis, parameters),
              mesh.scaling.y * calculate(yAxis, parameters),
              mesh.scaling.z * calculate(zAxis, parameters)
            );
          }
        });
      } catch (err) {
        alert("Invalid properties. Please try again.");
        return;
      }
    } else {
      const firstSelectedModel: any = arrayModel.find(
        (model) => model.id === firstSelected
      );
      const mesh = mainScene.getMeshById(firstSelected);
      mesh.scaling = new Vector3(
        mesh.scaling.x * calculate(xAxis, parameters),
        mesh.scaling.y * calculate(yAxis, parameters),
        mesh.scaling.z * calculate(zAxis, parameters)
      );

      dispatch(
        modelAltered({
          ...firstSelectedModel,
          scaling: {
            x: firstSelectedModel?.scaling?.x * calculate(xAxis, parameters),
            y: firstSelectedModel?.scaling?.y * calculate(yAxis, parameters),
            z: firstSelectedModel?.scaling?.z * calculate(zAxis, parameters),
          },
          selected: false,
        })
      );
    }
    setVisible(false);
    dispatch(setFirstSelected(undefined));
  };

  const handleCancel = (e: any) => {
    if (isMultipleSelected()) {
      const models = selectedModels;
      models.map((model) => {
        dispatch(
          modelAltered({
            ...model,
            selected: false,
          })
        );
      });
    } else {
      const firstSelectedModel = arrayModel.find(
        (model) => model.id === firstSelected
      );
      const mesh = mainScene.getMeshById(firstSelected);
      dispatch(
        modelAltered({
          ...firstSelectedModel,
          selected: false,
        })
      );
    }
    setVisible(false);
    dispatch(setFirstSelected(undefined));
  };

  return (
    <DraggableModal
      title={
        <h1 className="cursor-pointer bg-red-300 w-full text-xl font-semibold rounded-t-md py-2 text-center border-b-2 border-gray-800">
          Scale
        </h1>
      }
      visible={visible}
      buttons={
        <div className="flex flex-row gap-1 justify-center">
          <button
            onClick={handleOk}
            id="scale-ok-btn"
            className="bg-green-300 hover:bg-green-400 rounded text-center px-4 py-1 disable-drag"
          >
            OK
          </button>
          <button
            onClick={handleCancel}
            id="scale-cancel-btn"
            className="bg-red-300 hover:bg-red-400 rounded text-center px-4 py-1 disable-drag"
          >
            Cancel
          </button>
        </div>
      }
    >
      <form>
        <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-3">
          <div className="col-span-full flex items-center">
            <label
              htmlFor="xAxis"
              className="flex text-sm font-large leading-6 text-gray-900 mr-2"
            >
              X
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="xAxis"
                value={xAxis}
                onChange={handleXAxisChanges}
                id="xAxis"
                autoComplete="off"
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-full flex items-center">
            <label
              htmlFor="yAxis"
              className="block text-sm font-medium leading-6 text-gray-900 mr-2"
            >
              Y
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="yAxis"
                value={yAxis}
                onChange={handleYAxisChanges}
                id="yAxis"
                autoComplete="off"
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-full flex items-center">
            <label
              htmlFor="zAxis"
              className="block text-sm font-medium leading-6 text-gray-900 mr-2"
            >
              Z
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="zAxis"
                value={zAxis}
                onChange={handleZAxisChanges}
                id="zAxis"
                autoComplete="off"
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
        </div>
      </form>
    </DraggableModal>
  );
}

export default ScaleMenu;
