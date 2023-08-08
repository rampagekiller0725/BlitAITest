import React, { useState } from "react";
import { useAppSelector, useAppDispatch } from "state/hooks";
import "./ParametersBar.css";
import ParameterMenu from "./babylonjs/ActionsBar/Transform/ParameterMenu";
import {
  selectParameters,
  deleteParameter,
  addParameter,
  editParameter,
} from "state/reducers/parametersSlice";
import MyIcon from "assets/MyIcons";

function ParametersBar() {
  const [visible, setVisible] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [parameter, setParameter] = useState({});
  const parameters = useAppSelector(selectParameters);

  const dispatch = useAppDispatch();

  function openAddParameterDialog() {
    setIsEditable(false);
    setVisible(true);
    setParameter({});
  }

  function editParameterFunc(id: string) {
    parameters.map((parameter) => {
      if (parameter.id === id) {
        setIsEditable(true);
        setVisible(true);
        setParameter(parameter);
        return;
      }
    });
  }

  function removeParameter(id: string) {
    dispatch(deleteParameter(id));
  }

  return (
    <div className="parameters-bar h-40 overflow-auto MuiBox-root css-38zrbw">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left ">
          <thead className="text-s text-gray-700 bg-gray-100">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Expression
              </th>
              <th scope="col" className="px-6 py-3">
                Value
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((parameter) => (
              <tr
                className="bg-white border-b hover:bg-gray-50 active:bg-gray-200"
                onClick={() => editParameterFunc(parameter.id)}
              >
                <td
                  scope="row"
                  className="px-6 py-1 font-medium text-gray-900 whitespace-nowrap"
                >
                  {parameter.name}
                </td>
                <td className="px-6 py-1">{parameter.expression}</td>
                <td className="px-6 py-1">{parameter.value}</td>
                <td className="px-6 py-1">
                  {parameter.description == "" ? "-" : parameter.description}
                </td>
                <td>
                  <button
                    className="w-10 h-10 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeParameter(parameter.id);
                    }}
                  >
                    <svg
                      width="18"
                      height="20"
                      viewBox="0 0 18 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12.3333 5V4.33333C12.3333 3.39991 12.3333 2.9332 12.1517 2.57668C11.9919 2.26308 11.7369 2.00811 11.4233 1.84832C11.0668 1.66667 10.6001 1.66667 9.66667 1.66667H8.33333C7.39991 1.66667 6.9332 1.66667 6.57668 1.84832C6.26308 2.00811 6.00811 2.26308 5.84832 2.57668C5.66667 2.9332 5.66667 3.39991 5.66667 4.33333V5M7.33333 9.58333V13.75M10.6667 9.58333V13.75M1.5 5H16.5M14.8333 5V14.3333C14.8333 15.7335 14.8333 16.4335 14.5608 16.9683C14.3212 17.4387 13.9387 17.8212 13.4683 18.0609C12.9335 18.3333 12.2335 18.3333 10.8333 18.3333H7.16667C5.76654 18.3333 5.06647 18.3333 4.53169 18.0609C4.06129 17.8212 3.67883 17.4387 3.43915 16.9683C3.16667 16.4335 3.16667 15.7335 3.16667 14.3333V5"
                        stroke="#D92D20"
                        strokeWidth="1.66667"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          className="flex items-center px-2 py-1 text-sm font-normal rounded-lg"
          onClick={openAddParameterDialog}
        >
          <MyIcon name="add-item" />
          <span className="flex-1 ml-3.5 text-base font-semibold whitespace-nowrap text-[#344054]">
            Add parameter...
          </span>
        </button>
      </div>
      <ParameterMenu
        visible={visible}
        setVisible={setVisible}
        isEditable={isEditable}
        isNewParameter={!isEditable}
        obj={parameter}
      />
    </div>
  );
}

export default ParametersBar;
