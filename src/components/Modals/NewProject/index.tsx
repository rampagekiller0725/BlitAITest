import { Dialog, Transition } from "@headlessui/react";
import { Auth, Storage } from "aws-amplify";
import { useState, Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "state/hooks";
import { selectSimulationProperties } from "state/reducers/simulationPropertiesSlice";
import { v4 as uuid } from "uuid";
import Modal from "../../Modal";
import { selectUsername } from "state/reducers/authSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import defaultMaterials from "materials.json";

interface NewProjectModalProps {
  visible: boolean;
  setVisible: (value: boolean) => void;
}

const NewProjectModal = (props: NewProjectModalProps) => {
  const { visible, setVisible } = props;

  const [name, setName] = useState<string>("New project");
  const [type, setType] = useState<string>("1");
  const [excitation, setExcitation] = useState<string>("sequential");
  const [f_min, setFMin] = useState<number>(1000000000);
  const [f_max, setFMax] = useState<number>(3000000000);
  const [pml_n, setPmlN] = useState<number>(8);
  const [end_criteria, setEndCriteria] = useState<number>(-40);
  const [farfield, setFarfield] = useState<number>(2400000000);
  const [e_field, setEField] = useState<number>(2400000000);
  const [h_field, setHField] = useState<number>(2400000000);
  const simulationProperties = useAppSelector(selectSimulationProperties);
  const [projectId, setProjectId] = useState("");
  const [projectDataSaved, setProjectDataSaved] = useState(false);
  const [propertiesDataSaved, setPropertiesDataSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const currentUsername = useAppSelector(selectUsername);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (projectId !== "" && projectDataSaved && propertiesDataSaved) {
      goToProjectPage(projectId);
    }
    //eslint-disable-next-line
  }, [projectId, projectDataSaved, propertiesDataSaved]);

  useEffect(() => {
    if (projectId !== "" && projectDataSaved) {
      const propertiesData = {
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

      propertiesDataMutation.mutate(propertiesData);
    }
  }, [projectId, projectDataSaved]);

  const goToProjectPage = (projectId: string) => {
    setIsLoading(false);
    navigate(`/project/${projectId}`, { replace: true });
  };

  const saveProjectInfo = async (infoData: any) => {
    const uid = uuid();
    await Storage.put(
      `${currentUsername}/projects/${uid}/info.json`,
      infoData,
      {
        cacheControl: "no-cache",
      }
    );
    setProjectId(uid);
  };

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

    const materials = await Storage.list(`${currentUsername}/materials.json`);
    if (materials.results.length === 0) {
      await Storage.put(`${currentUsername}/materials.json`, defaultMaterials, {
        cacheControl: "no-cache",
      });
    }
  };

  const projectInfoMutation = useMutation({
    mutationFn: (infoData: any) => saveProjectInfo(infoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectData"] });
      setProjectDataSaved(true);
    },
  });

  const propertiesDataMutation = useMutation({
    mutationFn: (propertiesData: any) => savePropertiesData(propertiesData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["simulationPropertiesData"] });
      setPropertiesDataSaved(true);
    },
  });

  const handleSubmit = async (evt: any) => {
    setIsLoading(true);
    const infoData = {
      project_name: name,
      "frequency range": `${f_min} - ${f_max} Hz`,
      type: "3D simulation",
      status: "Idle",
      percentage: 0,
      latestVersion: "v1",
    };

    projectInfoMutation.mutate(infoData);
  };

  const handleExcitationChange = (e: any) => {
    setExcitation(e.target.value);
  };

  return (
    <Modal
      visible={visible}
      title={"New project"}
      buttons={
        <>
          <button
            type="button"
            className={`relative shadow-sm ml-2 my-auto px-3 py-2 font-medium text-sm flex items-center justify-center align-middle rounded-md focus:outline-none text-white ${
              !isLoading
                ? "bg-primary-600 hover:bg-primary-700 active:bg-primary-800 hover:transition duration-150 shadow-lg hover:shadow-primary-600/50"
                : "bg-primary-300"
            }`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                aria-hidden="true"
                className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white inline"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              "Create"
            )}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 active:bg-gray-100 sm:mt-0 sm:w-auto"
            onClick={() => setVisible(false)}
          >
            Cancel
          </button>
        </>
      }
    >
      <form>
        <div className="mt-4 grid grid-cols-24 gap-x-6 gap-y-4">
          <div className="col-span-full mb-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <div className="mt-2">
              <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  autoComplete="off"
                  className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  onChange={(evt) => setName(evt.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="mt-1">
            <h3 className="font-medium">Simulation Properties</h3>
          </div>
          <div className="grid grid-cols-12 gap-x-6">
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
                htmlFor="fMin"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                fMin
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
                  <input
                    type="number"
                    name="fMin"
                    value={f_min}
                    onChange={(evt) => setFMin(evt.target.valueAsNumber)}
                    id="fMin"
                    autoComplete="off"
                    className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-6">
              <label
                htmlFor="fMax"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                fMax
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
                  <input
                    type="number"
                    name="fMax"
                    id="fMax"
                    value={f_max}
                    onChange={(evt) => setFMax(evt.target.valueAsNumber)}
                    autoComplete="off"
                    className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-6 mt-2">
              <label
                htmlFor="pmln"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                PMLN
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
                  <input
                    type="number"
                    name="pmln"
                    id="pmln"
                    value={pml_n}
                    onChange={(evt) => setPmlN(evt.target.valueAsNumber)}
                    autoComplete="off"
                    className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-6 mt-2">
              <label
                htmlFor="endCriteria"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                End Criteria
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
                  <input
                    type="number"
                    name="endCriteria"
                    id="endCriteria"
                    autoComplete="off"
                    className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    value={end_criteria}
                    onChange={(evt) => setEndCriteria(evt.target.valueAsNumber)}
                  />
                </div>
              </div>
            </div>
            <div className="col-span-6 mt-2">
              <label
                htmlFor="farField"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Far Field
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
                  <input
                    type="number"
                    name="farField"
                    id="farField"
                    value={farfield}
                    onChange={(evt) => setFarfield(evt.target.valueAsNumber)}
                    autoComplete="off"
                    className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-6 mt-2">
              <label
                htmlFor="eField"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                E Field
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
                  <input
                    type="number"
                    name="eField"
                    id="eField"
                    value={e_field}
                    onChange={(evt) => setEField(evt.target.valueAsNumber)}
                    autoComplete="off"
                    className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
            <div className="col-span-6 mt-2">
              <label
                htmlFor="hField"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                H Field
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm sm:max-w-lg ring-1 ring-inset ring-indigo-600 disable-drag">
                  <input
                    type="number"
                    name="hField"
                    id="hField"
                    value={h_field}
                    onChange={(evt) => setHField(evt.target.valueAsNumber)}
                    autoComplete="off"
                    className="block flex-1 border-0 bg-transparent py-1.5 px-1.5 pl-1 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default NewProjectModal;
