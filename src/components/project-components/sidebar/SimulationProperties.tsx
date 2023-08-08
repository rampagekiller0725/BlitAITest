import { useMutation, useQueryClient } from "@tanstack/react-query";
import DraggableModal from "components/DraggableModal";
import * as React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "state/hooks";
import { selectUsername } from "state/reducers/authSlice";
import {
  selectSimulationProperties,
  updateSimulationProperties,
} from "state/reducers/simulationPropertiesSlice";
import { Storage } from "aws-amplify";

export interface SimulationPropertiesProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

function SimulationProperties({
  visible,
  setVisible,
}: SimulationPropertiesProps) {
  const dispatch = useAppDispatch();
  const simulationProperties = useAppSelector(selectSimulationProperties);
  const currentUsername = useAppSelector(selectUsername);
  const { projectId } = useParams();
  const queryClient = useQueryClient();

  const [f_min, setFMin] = useState<number>(simulationProperties.f_min);
  const [f_max, setFMax] = useState<number>(simulationProperties.f_max);
  const [excitation, setExcitation] = useState<string>(
    simulationProperties.excitation
  );
  const [pml_n, setPmlN] = useState<number>(simulationProperties.pml_n);
  const [end_criteria, setEndCriteria] = useState<number>(
    simulationProperties.end_criteria
  );
  const [farfield, setFarfield] = useState<number>(
    simulationProperties.farfield
  );
  const [e_field, setEField] = useState<number>(simulationProperties.e_field);
  const [h_field, setHField] = useState<number>(simulationProperties.h_field);

  useEffect(() => {
    setFMin(simulationProperties.f_min);
    setFMax(simulationProperties.f_max);
    setExcitation(simulationProperties.excitation);
    setPmlN(simulationProperties.pml_n);
    setEndCriteria(simulationProperties.end_criteria);
    setFarfield(simulationProperties.farfield);
    setEField(simulationProperties.e_field);
    setHField(simulationProperties.h_field);
  }, [
    simulationProperties.f_min,
    simulationProperties.f_max,
    simulationProperties.excitation,
    simulationProperties.pml_n,
    simulationProperties.end_criteria,
    simulationProperties.farfield,
    simulationProperties.e_field,
    simulationProperties.h_field,
  ]);

  const savePropertiesData = async (propertiesData: any) => {
    await Storage.put(
      `${currentUsername}/projects/${projectId}/v1/properties.json`,
      propertiesData,
      {
        cacheControl: "no-cache",
      }
    );
    await Storage.put(
      `${currentUsername}/projects/${projectId}/v1/results/results.json`,
      {},
      {
        cacheControl: "no-cache",
      }
    );
  };

  const propertiesDataMutation = useMutation({
    mutationFn: (propertiesData: any) => savePropertiesData(propertiesData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["simulationPropertiesData"] });
    },
  });

  const handleFMinChanges = (e: any) => {
    setFMin(parseFloat(e.target.value));
  };
  const handleFMaxChanges = (e: any) => {
    setFMax(parseFloat(e.target.value));
  };
  const handleExcitationChange = (e: any) => {
    setExcitation(e.target.value);
  };
  const handlePmlNChanges = (e: any) => {
    setPmlN(parseFloat(e.target.value));
  };
  const handleEndCriteriaChanges = (e: any) => {
    setEndCriteria(parseFloat(e.target.value));
  };
  const handleFarFieldChanges = (e: any) => {
    setFarfield(parseFloat(e.target.value));
  };
  const handleEFieldChanges = (e: any) => {
    setEField(parseFloat(e.target.value));
  };
  const handleHFieldChanges = (e: any) => {
    setHField(parseFloat(e.target.value));
  };

  const handleOk = (e: any) => {
    const data = {
      ...simulationProperties,
      f_min,
      f_max,
      excitation,
      pml_n,
      end_criteria,
      farfield,
      e_field,
      h_field,
    };
    dispatch(updateSimulationProperties(data));
    propertiesDataMutation.mutate(data);
    setVisible(false);
  };

  return (
    // <Draggable>
    <DraggableModal
      visible={visible}
      title={
        <h1 className="cursor-pointer bg-red-300 w-full text-xl font-semibold rounded-t-md py-2 text-center border-b-2 border-gray-800">
          Simulation Properties
        </h1>
      }
      buttons={
        <div className="flex flex-row gap-1 justify-center">
          <button
            onClick={handleOk}
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
          <div className="col-span-6">
            <label
              htmlFor="fMin"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              F Min
            </label>
            <input
              type="number"
              name="fMin"
              value={f_min}
              onChange={handleFMinChanges}
              id="fMin"
              autoComplete="off"
              className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
            />
          </div>
          <div className="col-span-6">
            <label
              htmlFor="fMax"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              F Max
            </label>
            <input
              type="number"
              name="fMax"
              value={f_max}
              onChange={handleFMaxChanges}
              id="fMax"
              autoComplete="off"
              className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="excitationType"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Excitation Type
            </label>
            <div className="mt-1">
              <label>
                <input
                  type="radio"
                  name="excitation"
                  value="sequential"
                  checked={excitation === "sequential"}
                  onChange={handleExcitationChange}
                  className="mr-2"
                />
                Sequential
              </label>
              <label>
                <input
                  type="radio"
                  name="excitation"
                  value="simultaneous"
                  checked={excitation === "simultaneous"}
                  onChange={handleExcitationChange}
                  className="ml-4 mr-2"
                />
                Simultaneous
              </label>
            </div>
          </div>
          <div className="col-span-6">
            <label
              htmlFor="pml_n"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              PMLN
            </label>
            <input
              type="number"
              step="1"
              name="pml_n"
              value={pml_n}
              onChange={handlePmlNChanges}
              className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
            />
          </div>
          <div className="col-span-6">
            <label
              htmlFor="endCriteria"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              End Criteria
            </label>
            <input
              type="number"
              name="endCriteria"
              value={end_criteria}
              onChange={handleEndCriteriaChanges}
              id="fMin"
              autoComplete="off"
              className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
            />
          </div>
          <div className="col-span-6">
            <label
              htmlFor="farField"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Far Field
            </label>
            <input
              type="number"
              name="farField"
              value={farfield}
              onChange={handleFarFieldChanges}
              id="farField"
              autoComplete="off"
              className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
            />
          </div>
          <div className="col-span-6">
            <label
              htmlFor="e_field"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              E Field
            </label>
            <input
              type="number"
              name="e_field"
              value={e_field}
              onChange={handleEFieldChanges}
              id="e_field"
              autoComplete="off"
              className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
            />
          </div>
          <div className="col-span-6">
            <label
              htmlFor="h_field"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              H Field
            </label>
            <input
              type="number"
              name="h_field"
              value={h_field}
              onChange={handleHFieldChanges}
              id="h_field"
              autoComplete="off"
              className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600"
            />
          </div>
        </div>
      </form>
    </DraggableModal>
  );
}

export default SimulationProperties;
