import DraggableModal from "components/DraggableModal";
import * as React from "react";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "state/hooks";
import {
  modelAdded,
  modelAltered,
  selectModels,
} from "state/reducers/modelSlice";
import {
  isSceneClickable,
  setSceneClickable,
  selectPickedPos,
} from "state/reducers/sceneSlice";
import { selectSimulationProperties } from "state/reducers/simulationPropertiesSlice";
import { selectParameters } from "state/reducers/parametersSlice";
import { calculate } from "utilities";
import { v4 as uuid } from "uuid";

export interface LumpedPortProps {
  portLength: number;
  visible: boolean;
  setVisible: (value: boolean) => void;
  isEditableModal?: boolean;
  modelToBeAlter?: any;
}

function LumpedPortMenu({
  portLength,
  visible,
  setVisible,
  isEditableModal,
  modelToBeAlter,
}: LumpedPortProps) {
  const [portNumber, setPortNumber] = useState(portLength + 1);
  const [impedance, setImpedance] = useState("50");
  const [amplitude, setAmplitude] = useState("1");
  const [phase_shift, setPhaseShift] = useState("0");
  const [f_ref, setFRef] = useState(
    (useAppSelector(selectSimulationProperties).f_min +
      useAppSelector(selectSimulationProperties).f_max) /
      2
  );

  document.addEventListener("keydown", (event) => {
    if (visible) {
      if (event.key == "Escape") setVisible(false);
      else if (event.key == "Enter")
        document.getElementById("port-ok-btn")?.click();
    }
  });

  const [x1, setX1] = useState("");
  const [x2, setX2] = useState("");
  const [y1, setY1] = useState("");
  const [y2, setY2] = useState("");
  const [z1, setZ1] = useState("");
  const [z2, setZ2] = useState("");
  const [clickedButton, setClickedButton] = useState("");

  const dispatch = useAppDispatch();
  const models = useAppSelector(selectModels);
  const parameters = useAppSelector(selectParameters);
  const sceneClickalbe = useAppSelector(isSceneClickable);
  const pickedPos = useAppSelector(selectPickedPos);

  const getPortNumber = () => {
    for (let i = 0; i < models.length; i++) {
      let f = false;
      for (let j = 0; j < models.length; j++) {
        if (models[j].type == "port") {
          if (models[j]?.number == (i + 1).toString()) {
            f = true;
            break;
          }
        }
      }
      if (f == false) return i + 1;
    }
    return portLength + 1;
  };

  const isAvailablePortNumber = (pn: number) => {
    if (pn % 1 != 0) return false;
    if (pn <= 0) return false;
    for (let i = 0; i < models.length; i++) {
      if (models[i].type == "port") {
        if (models[i]?.number == pn.toString() && !isEditableModal)
          return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (sceneClickalbe) {
      if (clickedButton == "start") {
        setX1(
          pickedPos.x != null
            ? (Math.round(pickedPos.x * 100000) / 100000).toString()
            : "NaN"
        );
        setY1(
          pickedPos.y != null
            ? (Math.round(pickedPos.y * 100000) / 100000).toString()
            : "NaN"
        );
        setZ1(
          pickedPos.z != null
            ? (Math.round(pickedPos.z * 100000) / 100000).toString()
            : "NaN"
        );
      } else if (clickedButton == "end") {
        setX2(
          pickedPos.x != null
            ? (Math.round(pickedPos.x * 100000) / 100000).toString()
            : "NaN"
        );
        setY2(
          pickedPos.y != null
            ? (Math.round(pickedPos.y * 100000) / 100000).toString()
            : "NaN"
        );
        setZ2(
          pickedPos.z != null
            ? (Math.round(pickedPos.z * 100000) / 100000).toString()
            : "NaN"
        );
      }
      dispatch(setSceneClickable(false));
    }
  }, [pickedPos]);

  useEffect(() => {
    if (isEditableModal != undefined && visible) {
      setPortNumber(modelToBeAlter.number);
      setImpedance(modelToBeAlter.object.impedance);
      setAmplitude(modelToBeAlter.object.amplitude);
      setPhaseShift(modelToBeAlter.object.phase_shift);
      setFRef(modelToBeAlter.object.f_ref);
      setX1(modelToBeAlter.object.x.min);
      setX2(modelToBeAlter.object.x.max);
      setY1(modelToBeAlter.object.y.min);
      setY2(modelToBeAlter.object.y.max);
      setZ1(modelToBeAlter.object.z.min);
      setZ2(modelToBeAlter.object.z.max);
    } else {
      let portNumber = getPortNumber();
      setPortNumber(portNumber);
    }
  }, [isEditableModal, visible]);

  const handleChanges = (e: any) => {
    switch (e.target.name) {
      case "name":
        setPortNumber(e.target.value);
        break;
      case "impedance":
        setImpedance(e.target.value);
        break;
      case "amplitude":
        setAmplitude(e.target.value);
        break;
      case "phase_shift":
        setPhaseShift(e.target.value);
        break;
      case "f_ref":
        setFRef(e.target.value);
        break;
      case "x1":
        setX1(e.target.value);
        break;
      case "x2":
        setX2(e.target.value);
        break;
      case "y1":
        setY1(e.target.value);
        break;
      case "y2":
        setY2(e.target.value);
        break;
      case "z1":
        setZ1(e.target.value);
        break;
      case "z2":
        setZ2(e.target.value);
        break;
    }
  };

  const handleOk = (e: any) => {
    if (!portNumber) {
      alert("Port number cannot be empty.");
      return;
    }
    if (!isAvailablePortNumber(portNumber)) {
      alert("Port number must be an available positive integer.");
      return;
    }
    try {
      calculate(impedance, parameters);
      calculate(amplitude, parameters);
      calculate(phase_shift, parameters);
      calculate(x1, parameters);
      calculate(x2, parameters);
      calculate(y1, parameters);
      calculate(y2, parameters);
      calculate(z1, parameters);
      calculate(z2, parameters);
    } catch (err) {
      alert("Invalid properties. Please try again.");
      return;
    }

    if (
      (calculate(x1, parameters) !== calculate(x2, parameters) &&
        calculate(y1, parameters) !== calculate(y2, parameters)) || // not parallel to x-axis and different x values
      (calculate(x1, parameters) !== calculate(x2, parameters) &&
        calculate(z1, parameters) !== calculate(z2, parameters)) || // not parallel to y-axis and different x values
      (calculate(y1, parameters) !== calculate(y2, parameters) &&
        calculate(z1, parameters) !== calculate(z2, parameters)) || // not parallel to z-axis and different y values
      (calculate(x1, parameters) === calculate(x2, parameters) &&
        calculate(y1, parameters) === calculate(y1, parameters) &&
        calculate(z1, parameters) === calculate(z2, parameters)) // the same points
    ) {
      alert("Excitation vector must be parallel to the X, Y or Z axis.");
      return;
    }

    const model = {
      id: uuid(),
      number: portNumber,
      name:
        "Port " + portNumber + " (" + calculate(impedance, parameters) + " Ω)",
      type: "port",
      object: {
        impedance: impedance,
        amplitude: amplitude,
        phase_shift: phase_shift,
        f_ref: f_ref,
        x: {
          min: x1,
          max: x2,
        },
        y: {
          min: y1,
          max: y2,
        },
        z: {
          min: z1,
          max: z2,
        },
      },
      status: "Added",
      category: "Ports",
      visible: true,
      selected: false,
      material: "PEC",
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

    if (isEditableModal === undefined) {
      dispatch(modelAdded(model));
    } else {
      model.id = modelToBeAlter.id;
      model.status = "Updated";
      dispatch(modelAltered(model));
    }
    setVisible(false);
    dispatch(setSceneClickable(false));
  };

  const handleStart = (e: any) => {
    e.preventDefault();
    setClickedButton("start");
    dispatch(setSceneClickable(true));
  };

  const handleEnd = (e: any) => {
    e.preventDefault();
    setClickedButton("end");
    dispatch(setSceneClickable(true));
  };

  return (
    <DraggableModal
      title={
        <h1 className="bg-green-300 w-full text-xl font-semibold rounded-t-md py-2 text-center border-b-2 border-indigo-600">
          Lumped port
        </h1>
      }
      visible={visible}
      buttons={
        <div className="flex flex-row gap-1 justify-center">
          <button
            onClick={handleOk}
            id="port-ok-btn"
            className="bg-green-300 hover:bg-green-400 rounded text-center px-4 py-1 disable-drag"
          >
            OK
          </button>
          <button
            onClick={(e) => {
              setVisible(false);
              dispatch(setSceneClickable(false));
            }}
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
              Port number
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="number"
                name="name"
                value={portNumber}
                onChange={handleChanges}
                id="name"
                autoComplete="off"
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="impedance"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Impedance
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="impedance"
                value={impedance}
                onChange={handleChanges}
                id="impedance"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="amplitude"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Amplitude
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="amplitude"
                value={amplitude}
                onChange={handleChanges}
                id="amplitude"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="phase_shift"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Phase shift (°)
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="phase_shift"
                value={phase_shift}
                onChange={handleChanges}
                id="phase_shift"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="f_ref"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              {"Reference frequency:"}
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="f_ref"
                value={f_ref}
                onChange={handleChanges}
                id="f_ref"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <button
                className="block flex-1 border-0 bg-green-300 hover:bg-green-400 py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
                onClick={handleStart}
              >
                Start
              </button>
            </div>
          </div>
          <div className="col-span-6">
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <button
                className="block flex-1 border-0 bg-green-300 hover:bg-green-400 py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
                onClick={handleEnd}
              >
                End
              </button>
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="x1"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              X1
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="x1"
                value={x1}
                onChange={handleChanges}
                id="x1"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="x2"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              X2
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="x2"
                value={x2}
                onChange={handleChanges}
                id="x2"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="x1"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Y1
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="y1"
                value={y1}
                onChange={handleChanges}
                id="y1"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="y2"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Y2
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="y2"
                value={y2}
                onChange={handleChanges}
                id="y2"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="x1"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Z1
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="z1"
                value={z1}
                onChange={handleChanges}
                id="z1"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="z2"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Z2
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="z2"
                value={z2}
                onChange={handleChanges}
                id="z2"
                autoComplete="off"
                className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
        </div>
      </form>
    </DraggableModal>
    // <Draggable>
    //   <div
    //     style={{ left: menuPosition.x, top: menuPosition.y, position: "fixed" }}
    //     className="absolute bg-white w-fit rounded shadow z-10"
    //   >
    //     <h1 className="cursor-pointer bg-green-300 w-full text-xl font-semibold rounded-t-md py-2 text-center border-b-2 border-gray-800">
    //       Lumped port
    //     </h1>
    //     <div className="flex flex-col p-2">
    //       <div className="flex flex-col px-2 py-2 space-y-2">
    //         <div className="flex flex-row gap-2 items-center">
    //           <label className="text-center">Port number:</label>
    //           <input
    //             disabled
    //             type="text"
    //             name="name"
    //             min={portLength + 1}
    //             max="64"
    //             value={portNumber}
    //             onChange={handleChanges}
    //             className="w-12 px-1 py-1 border rounded-sm bg-gray-100"
    //           />
    //           <label className="text-center">Impedance:</label>
    //           <input
    //             type="text"
    //             name="impedance"
    //             min="0"
    //             max="10000"
    //             value={impedance}
    //             onChange={handleChanges}
    //             className="w-14 px-1 py-1 border rounded-sm"
    //           />
    //           <label className="text-center">Ω</label>
    //         </div>
    //         <div className="flex flex-row gap-2 items-center">
    //           <label className="text-center">Amplitude:</label>
    //           <input
    //             type="text"
    //             name="amplitude"
    //             min="0"
    //             max="1000"
    //             value={amplitude}
    //             onChange={handleChanges}
    //             className="w-14 px-1 py-1 border rounded-sm"
    //           />
    //           <label className="text-center">Phase shift:</label>
    //           <input
    //             type="text"
    //             name="phase_shift"
    //             min="0"
    //             max="360000"
    //             value={phase_shift}
    //             onChange={handleChanges}
    //             className="w-14 px-1 py-1 border rounded-sm"
    //           />
    //           <label className="text-center">° (ref: </label>
    //           <input
    //             type="text"
    //             name="f_ref"
    //             min="1"
    //             max="360000"
    //             value={f_ref}
    //             onChange={handleChanges}
    //             className="w-32 px-1 py-1 border rounded-sm"
    //           />
    //           <label className="text-center"> Hz)</label>
    //         </div>
    //         <div className="flex flex-row gap-4 items-center">
    //           <div className="flex flex-row gap-2">
    //             <label className="text-center">X1:</label>
    //             <input
    //               type="text"
    //               name="x1"
    //               value={x1}
    //               onChange={handleChanges}
    //               className="w-32 px-1 py-1 border rounded-sm"
    //             />
    //           </div>
    //           <div className="flex flex-row gap-2">
    //             <label className="text-center">X2:</label>
    //             <input
    //               type="text"
    //               name="x2"
    //               value={x2}
    //               onChange={handleChanges}
    //               className="w-32 px-1 py-1 border rounded-sm"
    //             />
    //           </div>
    //         </div>
    //         <div className="flex flex-row gap-4 items-center">
    //           <div className="flex flex-row gap-2">
    //             <label className="text-center">Y1:</label>
    //             <input
    //               type="text"
    //               name="y1"
    //               value={y1}
    //               onChange={handleChanges}
    //               className="w-32 px-1 py-1 border rounded-sm"
    //             />
    //           </div>
    //           <div className="flex flex-row gap-2">
    //             <label className="text-center">Y2:</label>
    //             <input
    //               type="text"
    //               name="y2"
    //               value={y2}
    //               onChange={handleChanges}
    //               className="w-32 px-1 py-1 border rounded-sm"
    //             />
    //           </div>
    //         </div>
    //         <div className="flex flex-row gap-4 items-center">
    //           <div className="flex flex-row gap-2">
    //             <label className="text-center">Z1:</label>
    //             <input
    //               type="text"
    //               name="z1"
    //               value={z1}
    //               onChange={handleChanges}
    //               className="w-32 px-1 py-1 border rounded-sm"
    //             />
    //           </div>
    //           <div className="flex flex-row gap-2">
    //             <label className="text-center">Z2:</label>
    //             <input
    //               type="text"
    //               name="z2"
    //               value={z2}
    //               onChange={handleChanges}
    //               className="w-32 px-1 py-1 border rounded-sm"
    //             />
    //           </div>
    //         </div>

    //         <div className="flex flex-row gap-1 justify-center pt-4">
    //           <button
    //             onClick={handleOk}
    //             className="bg-green-300 hover:bg-green-400 rounded text-center px-4 py-1"
    //           >
    //             OK
    //           </button>
    //           <button
    //             onClick={closeMenu}
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

export default LumpedPortMenu;
