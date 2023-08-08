import * as React from "react";
import { useState, useEffect } from "react";
import * as BABYLON from "babylonjs";
import { useAppDispatch, useAppSelector } from "state/hooks";
import {
  Model,
  selectFirstSelected,
  selectModels,
  setFirstSelected,
  modelAltered,
} from "state/reducers/modelSlice";
import { Vector3 } from "babylonjs";
import DraggableModal from "components/DraggableModal";
import { calculate, isParameter } from "utilities";
import { selectParameters } from "state/reducers/parametersSlice";

export interface RotateProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  mainScene: BABYLON.Scene | any;
}

function RotateMenu({ visible, setVisible, mainScene }: RotateProps) {
  const [xAxis, setXAxis] = useState("0");
  const [yAxis, setYAxis] = useState("0");
  const [zAxis, setZAxis] = useState("0");
  const [xOrigin, setXOrigin] = useState("0");
  const [yOrigin, setYOrigin] = useState("0");
  const [zOrigin, setZOrigin] = useState("0");
  const [isShapeCenter, setIsShapeCenter] = useState(true);
  const [isRotationChanged, setIsRotationChanged] = useState(false);
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
        document.getElementById("rotate-cancel-btn")?.click();
      else if (event.key == "Enter")
        document.getElementById("rotate-ok-btn")?.click();
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
      setXAxis("0");
      setYAxis("0");
      setZAxis("0");
    } else {
      let mesh = mainScene.getMeshById(firstSelected);

      if (mesh) {
        setXAxis(mesh.rotation.x);
        setYAxis(mesh.rotation.y);
        setZAxis(mesh.rotation.z);
      }
    }
  }, [selectedModels]);

  // useEffect(() => {
  //   if (isRotationChanged && mainScene && mainScene !== null) {
  //     if (isMultipleSelected()) {
  //       const currentRotation = selectedModels.find(
  //         (model) => model.id === firstSelected
  //       )?.rotation;
  //       if (currentRotation) {
  //         try {
  //           selectedModels.map((model) => {
  //             const mesh = mainScene.getMeshById(model.id);
  //             if (mesh) {
  //               mesh.rotation = new Vector3(
  //                 model.rotation.x +
  //                   (calculate(xAxis, parameters) * Math.PI) / 180,
  //                 model.rotation.y +
  //                   (calculate(yAxis, parameters) * Math.PI) / 180,
  //                 model.rotation.z +
  //                   (calculate(zAxis, parameters) * Math.PI) / 180
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
  //         isShapeCenter
  //           ? mesh.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 0))
  //           : mesh.setPivotMatrix(
  //               BABYLON.Matrix.Translation(
  //                 -calculate(xOrigin, parameters),
  //                 -calculate(yOrigin, parameters),
  //                 -calculate(zOrigin, parameters)
  //               )
  //             );
  //         mesh.rotation = new Vector3(
  //           (calculate(xAxis, parameters) * Math.PI) / 180,
  //           (calculate(yAxis, parameters) * Math.PI) / 180,
  //           (calculate(zAxis, parameters) * Math.PI) / 180
  //         );
  //       } catch (err) {
  //         alert("please input correct value");
  //         return;
  //       }
  //     }
  //     setIsRotationChanged(false);
  //   }
  // }, [xAxis, yAxis, zAxis, xOrigin, yOrigin, zOrigin, isRotationChanged]);

  const handleXAxisChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) setIsRotationChanged(true);
    setXAxis(e.target.value);
  };

  const handleYAxisChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) setIsRotationChanged(true);
    setYAxis(e.target.value);
  };

  const handleZAxisChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) setIsRotationChanged(true);
    setZAxis(e.target.value);
  };

  const handleXOriginChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) setIsRotationChanged(true);
    setXOrigin(e.target.value);
  };

  const handleYOriginChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) setIsRotationChanged(true);
    setYOrigin(e.target.value);
  };

  const handleZOriginChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) setIsRotationChanged(true);
    setZOrigin(e.target.value);
  };

  const handleIsShapeCenterChanges = (e: any) => {
    setIsRotationChanged(true);
    setIsShapeCenter(e.target.checked);
  };

  const handleOk = (e: any) => {
    if (isMultipleSelected()) {
      const models = selectedModels;
      try {
        models.map((model) => {
          dispatch(
            modelAltered({
              ...model,
              rotation: {
                x:
                  model.rotation.x +
                  (calculate(xAxis, parameters) * 180) / Math.PI,
                y:
                  model.rotation.y +
                  (calculate(yAxis, parameters) * 180) / Math.PI,
                z:
                  model.rotation.z +
                  (calculate(zAxis, parameters) * 180) / Math.PI,
              },
              selected: false,
            })
          );
        });
        selectedModels.map((model) => {
          const mesh = mainScene.getMeshById(model.id);
          if (mesh) {
            mesh.rotation = new Vector3(
              model.rotation.x + (calculate(xAxis, parameters) * Math.PI) / 180,
              model.rotation.y + (calculate(yAxis, parameters) * Math.PI) / 180,
              model.rotation.z + (calculate(zAxis, parameters) * Math.PI) / 180
            );
          }
        });
      } catch (err) {
        alert("Invalid properties. Please try again.");
        return;
      }
    } else {
      const firstSelectedModel = arrayModel.find(
        (model) => model.id === firstSelected
      );
      const mesh = mainScene.getMeshById(firstSelected);
      dispatch(
        modelAltered({
          ...firstSelectedModel,
          position: {
            x: mesh.rotation.x,
            y: mesh.rotation.y,
            z: mesh.rotation.z,
          },
          selected: false,
        })
      );
      isShapeCenter
        ? mesh.setPivotMatrix(BABYLON.Matrix.Translation(0, 0, 0))
        : mesh.setPivotMatrix(
            BABYLON.Matrix.Translation(
              -calculate(xOrigin, parameters),
              -calculate(yOrigin, parameters),
              -calculate(zOrigin, parameters)
            )
          );
      mesh.rotation = new Vector3(
        (calculate(xAxis, parameters) * Math.PI) / 180,
        (calculate(yAxis, parameters) * Math.PI) / 180,
        (calculate(zAxis, parameters) * Math.PI) / 180
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
          position: {
            x: mesh.rotation.x - (calculate(xAxis, parameters) * 180) / Math.PI,
            y: mesh.rotation.y - (calculate(yAxis, parameters) * 180) / Math.PI,
            z: mesh.rotation.z - (calculate(zAxis, parameters) * 180) / Math.PI,
          },
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
          Rotate
        </h1>
      }
      visible={visible}
      buttons={
        <div className="flex flex-row gap-1 justify-center">
          <button
            onClick={handleOk}
            id="rotate-ok-btn"
            className="bg-green-300 hover:bg-green-400 rounded text-center px-4 py-1 disable-drag"
          >
            OK
          </button>
          <button
            onClick={handleCancel}
            id="rotate-cancel-btn"
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
              htmlFor="xOrigin"
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
          <div className="col-span-full flex items-center">
            <label
              htmlFor="shapeCenter"
              className="block text-sm font-medium leading-6 text-gray-900 mr-2"
            >
              Shape Center
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="checkbox"
                name="shapeCenter"
                onChange={handleIsShapeCenterChanges}
                id="shapeCenter"
                autoComplete="off"
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
                checked={isShapeCenter}
              />
            </div>
          </div>
          <div className="col-span-full flex items-center">
            <label
              htmlFor="zAxis"
              className="block text-sm font-medium leading-6 text-gray-900 mr-2"
            >
              XOrigin
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="xOrigin"
                value={xOrigin}
                onChange={handleXOriginChanges}
                id="xOrigin"
                autoComplete="off"
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
                disabled={isShapeCenter}
              />
            </div>
          </div>

          <div className="col-span-full flex items-center">
            <label
              htmlFor="yOrigin"
              className="block text-sm font-medium leading-6 text-gray-900 mr-2"
            >
              YOrigin
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="yOrigin"
                value={yOrigin}
                onChange={handleYOriginChanges}
                id="yOrigin"
                autoComplete="off"
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
                disabled={isShapeCenter}
              />
            </div>
          </div>

          <div className="col-span-full flex items-center">
            <label
              htmlFor="zOrigin"
              className="block text-sm font-medium leading-6 text-gray-900 mr-2"
            >
              ZOrigin
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="zOrigin"
                value={zOrigin}
                onChange={handleZOriginChanges}
                id="zOrigin"
                autoComplete="off"
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
                disabled={isShapeCenter}
              />
            </div>
          </div>
        </div>
      </form>
    </DraggableModal>
    // <Draggable>
    //   <div
    //     style={{ left: menuPosition.x, top: menuPosition.y }}
    //     className="absolute bg-white w-fit rounded shadow z-10"
    //   >
    //     <h1 className="cursor-pointer bg-red-300 w-full text-xl font-semibold rounded-t-md py-2 text-center border-b-2 border-gray-800">
    //       Rotate
    //     </h1>
    //     <div className="flex flex-col p-2">
    //       <div className="flex flex-col px-2 py-2 space-y-2">
    //         <div className="flex flex-row gap-4 items-center">
    //           <label className="text-center">X Axis:</label>
    //           <input
    //             type="text"
    //             step="0.01"
    //             name="xAxis"
    //             value={xAxis}
    //             onChange={handleXAxisChanges}
    //             className="w-32 px-1 py-1 border rounded-sm"
    //           />
    //         </div>
    //         <div className="flex flex-row gap-4 items-center">
    //           <label className="text-center">Y Axis:</label>
    //           <input
    //             type="text"
    //             step="0.01"
    //             name="yAxis"
    //             value={yAxis}
    //             onChange={handleYAxisChanges}
    //             className="w-32 px-1 py-1 border rounded-sm"
    //           />
    //         </div>
    //         <div className="flex flex-row gap-4 items-center">
    //           <label className="text-center">Z Axis:</label>
    //           <input
    //             type="text"
    //             step="0.01"
    //             name="zAxis"
    //             value={zAxis}
    //             onChange={handleZAxisChanges}
    //             className="w-32 px-1 py-1 border rounded-sm"
    //           />
    //         </div>
    //         <div className="flex flex-row gap-1 justify-center pt-4">
    //           <button
    //             onClick={handleOk}
    //             className="bg-green-300 hover:bg-green-400 rounded text-center px-4 py-1"
    //           >
    //             OK
    //           </button>
    //           <button
    //             onClick={handleCancel}
    //             className="bg-red-300 hover:bg-red-400 rounded text-center px-4 py-1"
    //           >
    //             Cancel
    //           </button>
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </Draggable>
  );
}

export default RotateMenu;
