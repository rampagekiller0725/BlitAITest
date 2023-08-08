import { useAppDispatch, useAppSelector } from "state/hooks";
import { Model, modelAltered } from "state/reducers/modelSlice";
import { Storage } from "aws-amplify";
import { selectUsername } from "state/reducers/authSlice";
import { useEffect, useState } from "react";
import Materials from "../types/materials";
import MyIcon from "assets/MyIcons";
import { Tooltip } from "react-tooltip";

interface MaterialMenuProps {
  models: Model[];
  isMultiSelect: boolean;
}

const MaterialMenu = ({ models, isMultiSelect }: MaterialMenuProps) => {
  const [materials, setMaterials] = useState<Materials | null>(null);

  const dispatch = useAppDispatch();
  const materialToBeChangedModels = models.filter(
    (model) => model.selected === true
  );

  const username = useAppSelector(selectUsername);

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

  const onMaterialChange = (material: string, clickedObject: Model) => {
    const alteredObject = {
      ...clickedObject,
      status: "Altered",
      material: material,
    };
    dispatch(modelAltered(alteredObject));
  };

  const menuItemClickHandler = (material: string) => {
    if (isMultiSelect) {
      materialToBeChangedModels.forEach((model) => {
        onMaterialChange(material, model);
      });
    } else {
      onMaterialChange(material, materialToBeChangedModels[0]);
    }
  };

  const showMaterialUsedMark = (material: string) => {
    if (isMultiSelect) {
      if (
        materialToBeChangedModels.some(
          (model) => model.selected && model.material === material
        )
      ) {
        return <MyIcon name="check-square" />;
      }
    } else {
      if (materialToBeChangedModels[0]?.material === material) {
        return <MyIcon name="check-square" />;
      }
    }
  };

  return (
    materials && (
      <div
        className="absolute left-40 top-12 z-50 w-64 bg-gray-25 rounded divide-y divide-gray-100 shadow"
        style={{ maxHeight: "400px", overflow: "auto" }}
      >
        <ul className="text-sm text-gray-700 px-2 py-2">
          <li>
            <button className="flex justify-between text-primary-600 rounded text-left w-full py-2 px-4 hover:bg-primary-200 active:bg-primary-300">
              <svg
                className="w-5 h-5"
                width="10"
                height="10"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.335 5.63056V13.0394M5.63056 9.335H13.0394M5.44533 17.67H13.2247C14.7807 17.67 15.5587 17.67 16.153 17.3672C16.6758 17.1008 17.1008 16.6758 17.3672 16.153C17.67 15.5587 17.67 14.7807 17.67 13.2247V5.44533C17.67 3.88932 17.67 3.11131 17.3672 2.517C17.1008 1.99422 16.6758 1.56919 16.153 1.30282C15.5587 1 14.7807 1 13.2247 1H5.44533C3.88932 1 3.11131 1 2.517 1.30282C1.99422 1.56919 1.56919 1.99422 1.30282 2.517C1 3.11131 1 3.88932 1 5.44533V13.2247C1 14.7807 1 15.5587 1.30282 16.153C1.56919 16.6758 1.99422 17.1008 2.517 17.3672C3.11131 17.67 3.88932 17.67 5.44533 17.67Z"
                  stroke="#7F56D9"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              New material...
              <div></div>
            </button>
          </li>
          <li>
            <hr className="my-2" />
          </li>

          {Object.keys(materials).map((material, index) => {
            const epsilon =
              materials[material]?.epsilon !== undefined
                ? materials[material].epsilon
                : "-";
            const mu =
              materials[material]?.mu !== undefined
                ? materials[material].mu
                : "-";
            const kappa =
              materials[material]?.kappa !== undefined
                ? materials[material].kappa
                : "-";
            return (
              <li key={index + 1}>
                <button
                  onClick={(e) => {
                    menuItemClickHandler(material);
                  }}
                  className={`flex justify-between rounded text-left w-full py-2 px-4 hover:bg-gray-200 ${
                    materialToBeChangedModels.some(
                      (model) => model.material === material
                    )
                      ? "font-bold bg-gray-200 hover:bg-gray-200"
                      : ""
                  }`}
                >
                  {showMaterialUsedMark(material)}
                  {material}
                  <MyIcon
                    name="info-circle"
                    data-tooltip-id="material-info-tooltip"
                    data-tooltip-content={`Epsilon: ${epsilon}\nMu: ${mu}\nKappa: ${kappa}`}
                    data-tooltip-place="top"
                  ></MyIcon>
                  <Tooltip
                    id="material-info-tooltip"
                    style={{ whiteSpace: "pre-wrap" }}
                  />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    )
  );
};

export default MaterialMenu;
