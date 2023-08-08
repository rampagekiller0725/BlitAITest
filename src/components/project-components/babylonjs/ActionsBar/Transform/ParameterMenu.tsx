import * as React from "react";
import { useState, useEffect, useRef } from "react";
import * as BABYLON from "babylonjs";
import { Vector3 } from "babylonjs";
import { useAppSelector, useAppDispatch } from "state/hooks";
import DraggableModal from "components/DraggableModal";
import { modelAltered, selectModels } from "state/reducers/modelSlice";

import { addParameter, editParameter } from "state/reducers/parametersSlice";
import { v4 as uuid } from "uuid";
import { selectParameters } from "state/reducers/parametersSlice";

const stringMath = require("string-math");

export interface ParameterMenu {
  visible: boolean;
  setVisible: any;
  isEditable: boolean;
  isNewParameter: boolean;
  obj?: any;
}

function ParameterMenu({
  visible,
  setVisible,
  isEditable,
  isNewParameter,
  obj,
}: ParameterMenu) {
  const [parameterName, setParameterName] = useState("");
  const [parameterExpression, setParameterExpression] = useState("");
  const [parameterDescription, setParameterDescription] = useState("");

  const dispatch = useAppDispatch();
  var models = useAppSelector(selectModels);
  var parameters = useAppSelector(selectParameters);

  document.addEventListener("keydown", (event) => {
    if (visible) {
      if (event.key === "Escape") {
        setVisible(false);
      } else if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("parameter-ok-btn")?.click();
      }
    }
  });

  useEffect(() => {
    if (isEditable) {
      setParameterName(obj.name);
      setParameterExpression(obj.expression);
      setParameterDescription(obj.description);
    }
    if (isNewParameter) {
      setParameterName("");
      setParameterExpression("");
      setParameterDescription("");
    }
  }, [obj, isEditable, isNewParameter]);

  const isValidIdentifier = (str: string) => {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(str);
  };

  const handleOk = (e: any) => {
    if (!isValidIdentifier(parameterName)) {
      alert(
        "Invalid parameter name. It must start with a letter or underscore and contain only letters, numbers, and underscores."
      );
      return;
    }
    for (let i = 0; i < parameters.length; i++) {
      if (parameters[i].name === parameterName) {
        if ((isEditable && obj.name !== parameterName) || !isEditable) {
          alert("Parameter name already exists!");
          return;
        }
      }
    }
    if (isEditable) {
      try {
        let value = stringMath(parameterExpression);
        dispatch(
          editParameter({
            id: obj.id,
            name: parameterName,
            expression: parameterExpression,
            value: value,
            description: parameterDescription,
          })
        );
        models.map((model) => {
          let newModel = {
            ...model,
            status: "Updated",
          };
          dispatch(modelAltered(newModel));
        });
        setVisible(!visible);
      } catch (err) {
        alert("Please type correct expression");
      }
    } else {
      try {
        let value = stringMath(parameterExpression);
        dispatch(
          addParameter({
            id: uuid(),
            name: parameterName,
            expression: parameterExpression,
            value: value,
            description: parameterDescription,
          })
        );
        setVisible(!visible);
      } catch (err) {
        alert("Please type correct expression");
      }
    }
  };
  const handleCancel = (e: any) => {
    setVisible(!visible);
  };

  const handleParameterName = (e: any) => {
    setParameterName(e.target.value);
  };
  const handleParameterExpression = (e: any) => {
    setParameterExpression(e.target.value);
  };
  const handleParameterDescription = (e: any) => {
    setParameterDescription(e.target.value);
  };
  return (
    <DraggableModal
      title={
        <h1 className="cursor-pointer bg-red-300 w-full text-xl font-semibold rounded-t-md py-2 text-center border-b-2 border-gray-800">
          Parameter
        </h1>
      }
      visible={visible}
      buttons={
        <div className="flex flex-row gap-1 justify-center">
          <button
            onClick={handleOk}
            id="parameter-ok-btn"
            className="bg-green-300 hover:bg-green-400 rounded text-center px-4 py-1 disable-drag"
          >
            OK
          </button>
          <button
            onClick={handleCancel}
            id="parameter-cancel-btn"
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
              htmlFor="name"
              className="flex text-sm font-large leading-6 text-gray-900 mr-2"
            >
              Name:
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="off"
                value={parameterName}
                onChange={handleParameterName}
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-full flex items-center">
            <label
              htmlFor="expression"
              className="block text-sm font-medium leading-6 text-gray-900 mr-2"
            >
              Expression:
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="expression"
                id="expression"
                autoComplete="off"
                value={parameterExpression}
                onChange={handleParameterExpression}
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
          <div className="col-span-full flex items-center">
            <label
              htmlFor="description"
              className="block text-sm font-medium leading-6 text-gray-900 mr-2"
            >
              Description:
            </label>
            <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
              <input
                type="text"
                name="description"
                id="description"
                autoComplete="off"
                value={parameterDescription}
                onChange={handleParameterDescription}
                className="flex flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm rounded-md shadow-sm ring-1 ring-inset ring-indigo-600"
              />
            </div>
          </div>
        </div>
      </form>
    </DraggableModal>
  );
}

export default ParameterMenu;
