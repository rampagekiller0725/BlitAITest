import * as React from "react";
import { useState, useEffect } from "react";
import * as BABYLON from "babylonjs";
import {
  Model,
  setFirstSelected,
  selectModels,
  selectFirstSelected,
  modelAltered,
  modelAdded,
} from "state/reducers/modelSlice";
import { Vector3 } from "babylonjs";
import { useAppSelector, useAppDispatch } from "state/hooks";
import DraggableModal from "components/DraggableModal";
import { calculate, isParameter } from "utilities";
import { selectParameters } from "state/reducers/parametersSlice";
import { v4 as uuid } from "uuid";
export interface TranslateProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
  mainScene: BABYLON.Scene | any;
}

function TranslateMenu({ visible, setVisible, mainScene }: TranslateProps) {
  const [xAxis, setXAxis] = useState("0");
  const [yAxis, setYAxis] = useState("0");
  const [zAxis, setZAxis] = useState("0");
  const [factor, setFactor] = useState(1);
  const [isCanCopy, setIsCanCopy] = useState(false);

  const [isPositionChanged, setIsPositionChanged] = useState(false);
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
        document.getElementById("translate-cancel-btn")?.click();
      else if (event.key == "Enter")
        document.getElementById("translate-ok-btn")?.click();
    }
  });

  const isMultipleSelected = () => {
    if (selectedModels.length <= 1) {
      return false;
    }
    return true;
  };
  useEffect(() => {
    if (visible === false) return;
    setSelectedModels(arrayModel.filter((model) => model.selected));
  }, [visible]);

  useEffect(() => {
    if (isMultipleSelected()) {
      setXAxis("0");
      setYAxis("0");
      setZAxis("0");
    } else {
      let mesh = mainScene.getMeshById(firstSelected);
      if (mesh) {
        setXAxis(mesh.position.x);
        setYAxis(mesh.position.y);
        setZAxis(mesh.position.z);
      }
    }
  }, [selectedModels]);

  useEffect(() => {
    if (isPositionChanged && mainScene && mainScene !== null) {
      if (isMultipleSelected()) {
        const currentPosition = selectedModels.find(
          (model) => model.id === firstSelected
        )?.position;
        if (currentPosition) {
          selectedModels.map((model) => {
            const mesh = mainScene.getMeshById(model.id);
            if (mesh) {
              mesh.position = new Vector3(
                model.position.x + calculate(xAxis, parameters),
                model.position.y + calculate(yAxis, parameters),
                model.position.z + calculate(zAxis, parameters)
              );
            }
          });
        }
      } else {
        const mesh = mainScene.getMeshById(firstSelected);
        mesh.position = new Vector3(
          calculate(xAxis, parameters),
          calculate(yAxis, parameters),
          calculate(zAxis, parameters)
        );
      }
      setIsPositionChanged(false);
    }
  }, [isPositionChanged]);

  const handleXAxisChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) {
      setIsPositionChanged(true);
    }
    setXAxis(e.target.value);
  };

  const handleYAxisChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) {
      setIsPositionChanged(true);
    }
    setYAxis(e.target.value);
  };

  const handleZAxisChanges = (e: any) => {
    if (isParameter(e.target.value, parameters)) {
      setIsPositionChanged(true);
    }
    setZAxis(e.target.value);
  };

  const handleFactorChanges = (e: any) => {
    setFactor(Number(e.target.value));
  };

  const handleIsCanCopyChanges = (e: any) => {
    setIsCanCopy(e.target.checked);
  };

  const handleOk = (e: any) => {
    setSelectedModels(arrayModel.filter((model) => model.selected));
    if (isMultipleSelected()) {
      const models = selectedModels;
      try {
        models.map((model) => {
          dispatch(
            modelAltered({
              ...model,
              position: {
                x: model.position.x + calculate(xAxis, parameters),
                y: model.position.y + calculate(yAxis, parameters),
                z: model.position.z + calculate(zAxis, parameters),
              },
              selected: false,
            })
          );
        });
      } catch (err) {
        alert("Invalid properties. Please try again.");
        return;
      }
    }
    const model = selectedModels[0];
    if (isCanCopy) {
      for (let i = 1; i < factor; i++) {
        try {
          var obj: any = {
            ...model,
            name: model.name + "_" + (i + 1),
            id: uuid(),
            selected: false,
            status: "Added",
            position: {
              x: calculate(xAxis, parameters) * (i + 1),
              y: calculate(yAxis, parameters) * (i + 1),
              z: calculate(zAxis, parameters) * (i + 1),
            },
            object: {
              name: model.name + "_" + (i + 1),
              xMin:
                calculate(xAxis, parameters) * (i + 1) -
                (calculate(Object(model).object.xMax, parameters) -
                  calculate(Object(model).object.xMin, parameters)) /
                  2,
              yMin:
                calculate(yAxis, parameters) * (i + 1) -
                (calculate(Object(model).object.yMax, parameters) -
                  calculate(Object(model).object.yMin, parameters)) /
                  2,
              zMin:
                calculate(zAxis, parameters) * (i + 1) -
                (calculate(Object(model).object.zMax, parameters) -
                  calculate(Object(model).object.zMin, parameters)) /
                  2,
              xMax:
                calculate(xAxis, parameters) * (i + 1) +
                (calculate(Object(model).object.xMax, parameters) -
                  calculate(Object(model).object.xMin, parameters)) /
                  2,
              yMax:
                calculate(yAxis, parameters) * (i + 1) +
                (calculate(Object(model).object.yMax, parameters) -
                  calculate(Object(model).object.yMin, parameters)) /
                  2,
              zMax:
                calculate(zAxis, parameters) * (i + 1) +
                (calculate(Object(model).object.zMax, parameters) -
                  calculate(Object(model).object.zMin, parameters)) /
                  2,
            },
          };
        } catch (err) {
          alert("Invalid properties. Please try again.");
          return;
        }
        dispatch(modelAdded(obj));
      }
    } else {
      try {
        var obj: any = {
          ...model,
          name: model.name,
          id: model.id,
          selected: false,
          status: "Updated",
          position: {
            x: calculate(xAxis, parameters) * factor,
            y: calculate(yAxis, parameters) * factor,
            z: calculate(zAxis, parameters) * factor,
          },
          object: {
            name: model.name,
            xMin:
              calculate(xAxis, parameters) * factor -
              (calculate(Object(model).object.xMax, parameters) -
                calculate(Object(model).object.xMin, parameters)) /
                2,
            yMin:
              calculate(yAxis, parameters) * factor -
              (calculate(Object(model).object.yMax, parameters) -
                calculate(Object(model).object.yMin, parameters)) /
                2,
            zMin:
              calculate(zAxis, parameters) * factor -
              (calculate(Object(model).object.zMax, parameters) -
                calculate(Object(model).object.zMin, parameters)) /
                2,
            xMax:
              calculate(xAxis, parameters) * factor +
              (calculate(Object(model).object.xMax, parameters) -
                calculate(Object(model).object.xMin, parameters)) /
                2,
            yMax:
              calculate(yAxis, parameters) * factor +
              (calculate(Object(model).object.yMax, parameters) -
                calculate(Object(model).object.yMin, parameters)) /
                2,
            zMax:
              calculate(zAxis, parameters) * factor +
              (calculate(Object(model).object.zMax, parameters) -
                calculate(Object(model).object.zMin, parameters)) /
                2,
          },
        };
      } catch (err) {
        alert("Invalid properties. Please try again.");
        return;
      }
      dispatch(modelAltered(obj));
    }
    setVisible(false);
    // dispatch(setFirstSelected(undefined));
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
      if (mesh) {
        mesh.position = new Vector3(
          firstSelectedModel?.position.x,
          firstSelectedModel?.position.y,
          firstSelectedModel?.position.z
        );
      }
    }
    setVisible(false);
    // dispatch(setFirstSelected(undefined));
  };

  return (
    <DraggableModal
      title={
        <h1 className="cursor-pointer bg-red-300 w-full text-xl font-semibold rounded-t-md py-2 text-center border-b-2 border-gray-800">
          Translate
        </h1>
      }
      visible={visible}
      buttons={
        <div className="flex flex-row gap-1 justify-center">
          <button
            onClick={handleOk}
            id="translate-ok-btn"
            className="bg-green-300 hover:bg-green-400 rounded text-center px-4 py-1 disable-drag"
          >
            OK
          </button>
          <button
            onClick={handleCancel}
            id="translate-cancel-btn"
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

          <div className="col-span-full flex items-center">
            <label
              htmlFor="factor"
              className="block text-sm font-medium leading-6 text-gray-900 mr-2"
            >
              Factor
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="factor"
                value={factor}
                onChange={handleFactorChanges}
                id="zAxis"
                autoComplete="off"
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>

          <div className="col-span-full flex items-center">
            <label
              htmlFor="copy"
              className="block text-sm font-medium leading-6 text-gray-900 mr-2"
            >
              Copy
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="checkbox"
                name="copy"
                onChange={handleIsCanCopyChanges}
                id="copy"
                autoComplete="off"
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
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
    //       Translate
    //     </h1>
    //     <div className="flex flex-col p-2">
    //       <div className="flex flex-col px-2 py-2 space-y-2">
    //         <div className="flex flex-row gap-4 items-center">
    //           <label className="text-center">X Axis:</label>
    //           <input
    //             type="text"
    //             step=".01"
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
    //             step=".01"
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
    //             step=".01"
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

export default TranslateMenu;
