import React, { useEffect, useRef, useState } from "react";
import MyIcon from "../../../../assets/MyIcons";

import SidebarItem from "./SidebarItem";
import ContextMenu from "../../babylonjs/ObjectComponent/ContextMenu";
import CubeMenu from "components/project-components/babylonjs/ActionsBar/Create/CubeMenu";
import SphereMenu from "components/project-components/babylonjs/ActionsBar/Create/SphereMenu";
import CylinderMenu from "components/project-components/babylonjs/ActionsBar/Create/CylinderMenu";
import LumpedPortMenu from "components/project-components/babylonjs/ActionsBar/Create/LumpedPortMenu";
import LumpedElementMenu from "components/project-components/babylonjs/ActionsBar/Create/LumpedElementMenu";
import { v4 as uuid } from "uuid";

// Type and reducers
import {
  Model,
  setFirstSelected,
  modelAltered,
  modelSaved,
  modelAdded,
  selectModels,
} from "state/reducers/modelSlice";

import { selectParameters } from "state/reducers/parametersSlice";
import { calculate } from "utilities";

import { useAppDispatch, useAppSelector } from "state/hooks";
import { selectSavedModels } from "state/reducers/modelSlice";

import { STLExport } from "babylonjs-serializers";
import { Mesh } from "babylonjs";

export interface SidebarItemListProps {
  scene: BABYLON.Scene;
  models: Model[];
  objCounter: number;
  pasteSavedModel: any;
  isCollapsed: boolean;
}

function SidebarItemList({
  scene,
  models,
  objCounter,
  pasteSavedModel,
  isCollapsed,
}: SidebarItemListProps) {
  const [maxHeight, setMaxHeight] = useState(isCollapsed ? "0" : "auto");
  const listRef = useRef<HTMLUListElement>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [clickedObject, setClickedObject] = useState({} as any);
  const [showMenu, setShowMenu] = useState(false);
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [isSelectedProperty, selectProperty] = useState(false);

  const [cubeMenuVisible, setCubeMenuVisible] = useState(false);
  const [sphereMenuVisible, setSphereMenuVisible] = useState(false);
  const [cylinderMenuVisible, setCylinderMenuVisible] = useState(false);
  const [lumpedPortMenuVisible, setLumpedPortMenuVisible] = useState(false);
  const [lumpedElementMenuVisible, setLumpedElementMenuVisible] =
    useState(false);

  var savedModels = useAppSelector(selectSavedModels);
  var prevKeyCode = "";
  const dispatch = useAppDispatch();
  const allModels = useAppSelector(selectModels);
  const parameters = useAppSelector(selectParameters);

  useEffect(() => {
    setShowMenu(false);
    document.addEventListener("click", () => {
      setShowMenu(false);
    });
  }, []);

  var lastCode: String = "";
  useEffect(() => {
    if (clickedObject.id) {
      document.onkeydown = (e) => {
        if (lastCode != "" && lastCode === e.code) return;
        lastCode = e.code;
        if (prevKeyCode === "ControlLeft") {
          if (e.code === "KeyC" && !Object.is(clickedObject, {})) {
            dispatch(modelSaved(clickedObject));
          } else if (e.code === "KeyV" && savedModels[0]) {
            pasteSavedModel();
          }
        }
        prevKeyCode = e.code;
      };

      document.addEventListener("keyup", () => {
        lastCode = "";
        prevKeyCode = "";
      });
    }
  }, [models, clickedObject]);

  useEffect(() => {
    if (models.length > 0) {
      models.map((model: any) => {
        switch (model.type) {
          case "port":
            dispatch(
              modelAltered({
                ...model,
                name:
                  "Port " +
                  model.number +
                  " (" +
                  calculate(model.object.impedance, parameters) +
                  " Ω)",
                status: "Updated",
              })
            );
            break;
          case "element":
            dispatch(
              modelAltered({
                ...model,
                name:
                  "Element " +
                  model.number +
                  " (R: " +
                  calculate(model.object.resistance, parameters) +
                  " Ω, L: " +
                  calculate(model.object.inductance, parameters) +
                  " H, C: " +
                  calculate(model.object.capacitance, parameters) +
                  " F)",
                status: "Updated",
              })
            );
            break;
        }
      });
    }
  }, [parameters]);

  const changeName = (e: any, clickedObject: any) => {
    e.preventDefault();
    const editableObject = {
      ...clickedObject,
      name: e.target.value,
      status: "Altered",
    };
    dispatch(modelAltered(editableObject));
  };

  const removeFocus = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      e.target.blur();
    }
  };

  const showContextMenu = (e: any, clickedObject: any) => {
    e.preventDefault();
    if (e.button === 2) {
      setMenuPosition({ x: e.pageX, y: e.pageY });
      setClickedObject(clickedObject);
      if (!isMultiSelect) {
        for (let model of models) {
          const alteredObject = {
            ...model,
            selected: false,
          };
          dispatch(modelAltered(alteredObject));
        }
        const alteredObject = {
          ...clickedObject,
          selected: true,
        };
        dispatch(modelAltered(alteredObject));
      }
      setShowMenu(true);
    }
  };

  const showPropertyMenu = (e: any, type: string) => {
    setCubeMenuVisible(false);
    setSphereMenuVisible(false);
    setCylinderMenuVisible(false);
    setLumpedPortMenuVisible(false);
    setLumpedElementMenuVisible(false);

    if (type === "cube") {
      setCubeMenuVisible(true);
    } else if (type === "sphere") {
      setSphereMenuVisible(true);
    } else if (type === "cylinder") {
      setCylinderMenuVisible(true);
    } else if (type === "port") {
      setLumpedPortMenuVisible(true);
    } else if (type === "element") {
      setLumpedElementMenuVisible(true);
    }
  };

  const setEditable = (e: any, clickedObject: Model, status: boolean): void => {
    e.preventDefault();
    const editableObject = {
      ...clickedObject,
      editable: status,
      status: "Altered",
    };
    dispatch(modelAltered(editableObject));
  };

  const exportObject = (e: any, clickedObject: any) => {
    e.preventDefault();
    // find clickedObject in objects and in object's childrens
    let exportObject = models.find((object) => object.id === clickedObject.id);
    let meshToExport: any = exportObject && scene.getMeshById(exportObject.id);
    if (meshToExport) {
      meshToExport = meshToExport as unknown as Mesh;
      STLExport.CreateSTL([meshToExport as Mesh], true);
    }
  };

  const clickedObjectDetails = (e: any, clickedObject: any) => {
    setClickedObject(clickedObject);
    const modelsToDraw = Object.values(allModels);
    const arrayModel = modelsToDraw.flat();

    if (e.ctrlKey || e.metaKey) {
      setIsMultiSelect(true);
      const selectedModel = {
        ...clickedObject,
        selected: !clickedObject.selected,
        status: "Altered",
      };
      const selectedModelsCount = models.filter(
        (model) => model.selected
      ).length;
      if (selectedModelsCount === 0) {
        dispatch(setFirstSelected(selectedModel.id));
      }
      if (selectedModelsCount === 1 && selectedModel.selected === false) {
        dispatch(setFirstSelected(undefined));
      }
      dispatch(modelAltered(selectedModel));
    } else {
      setIsMultiSelect(false);
      dispatch(setFirstSelected(undefined));
      arrayModel.forEach((model) => {
        if (model.id !== clickedObject.id) {
          const updatedModel = {
            ...model,
            status: "Altered",
            selected: false,
          };
          dispatch(modelAltered(updatedModel));
        }
      });
      const selectedModel = {
        ...clickedObject,
        status: "Altered",
        selected: true,
      };
      dispatch(modelAltered(selectedModel));
      dispatch(setFirstSelected(clickedObject.id));
    }
  };

  const toggleVisibility = (e: any, clickedObject: any) => {
    e.stopPropagation();
    const data = {
      ...clickedObject,
      visible: !clickedObject.visible,
      status: "Altered",
    };
    dispatch(modelAltered(data));
  };

  // const isDisabled = (object: Item) => {
  //   return object.editable;
  // };

  useEffect(() => {
    setMaxHeight(
      isCollapsed
        ? "0"
        : `${listRef.current ? listRef.current.scrollHeight : 0}px`
    );
  }, [isCollapsed, models]);
  return (
    <ul
      style={{ maxHeight }}
      className={`overflow-hidden transition-max-height duration-500 ease-in-out`}
      ref={listRef}
    >
      {models.map((model: Model) => {
        return (
          <li key={model.id} className="bg-green hover:bg-green">
            <div
              onClick={(e) => clickedObjectDetails(e, model)}
              onContextMenu={(e) => showContextMenu(e, model)}
              className={`flex items-center px-2 py-1 text-base font-medium text-gray-700 hover:bg-gray-200 rounded-lg ${
                model.selected ? "bg-gray-300 hover:bg-gray-300" : ""
              }`}
            >
              {/* Icon */}
              <MyIcon name={model.type} />

              {/* Name */}
              {!model.editable ? (
                <p className="w-full py-1 mx-1 px-1 bg-transparent focus:outline-black rounded">
                  {model.name}
                </p>
              ) : (
                <input
                  type="text"
                  className="w-full py-1 mx-1 px-1 bg-transparent focus:outline-black rounded"
                  value={model.name}
                  onChange={(e) => changeName(e, model)}
                  onBlur={(e) => {
                    setEditable(e, model, false);
                  }}
                  onKeyUp={(e) => removeFocus(e)}
                  autoFocus={model.editable}
                />
              )}

              {/* Toggle visibility */}
              <button onClick={(e) => toggleVisibility(e, model)}>
                {model.visible ? (
                  <MyIcon name="eye-open" />
                ) : (
                  <MyIcon name="eye-close" />
                )}
              </button>
            </div>
          </li>
        );
      })}

      {showMenu && (
        <ContextMenu
          menuPosition={menuPosition}
          models={models}
          isMultiSelect={isMultiSelect}
          setEditable={setEditable}
          clickedObject={clickedObject}
          exportObject={exportObject}
          showPropertyMenu={showPropertyMenu}
          pasteSavedModel={pasteSavedModel}
        />
      )}

      <CubeMenu
        visible={cubeMenuVisible}
        setVisible={(value: boolean) => setCubeMenuVisible(value)}
        isEditableModal={true}
        modelToBeAlter={clickedObject}
      />
      <SphereMenu
        visible={sphereMenuVisible}
        setVisible={(value: boolean) => setSphereMenuVisible(value)}
        isEditableModal={true}
        modelToBeAlter={clickedObject}
      />
      <CylinderMenu
        visible={cylinderMenuVisible}
        setVisible={(value: boolean) => setCylinderMenuVisible(value)}
        isEditableModal={true}
        modelToBeAlter={clickedObject}
      />
      <LumpedPortMenu
        portLength={objCounter}
        // portLength={1}
        visible={lumpedPortMenuVisible}
        // addLumpedPort={addPort}
        setVisible={(value: boolean) => setLumpedPortMenuVisible(value)}
        isEditableModal={true}
        modelToBeAlter={clickedObject}
      />
      <LumpedElementMenu
        elementLength={objCounter}
        // elementLength={1}
        visible={lumpedElementMenuVisible}
        // addLumpedElement={addElement}
        setVisible={(value: boolean) => setLumpedElementMenuVisible(value)}
        isEditableModal={true}
        modelToBeAlter={clickedObject}
      />
    </ul>
  );
}

export default SidebarItemList;

// Containers
/*
object.name === "Component" ? (
              <li key={index}>
                <div className="flex text-base font-medium text-[#344054] bg-[#F2F4F7] rounded-md py-2 flex-col">
                  <div
                    onContextMenu={(e) => {
                      showContextMenu(e, object);
                    }}
                    className="px-4 w-full"
                  >
                    {object.name}
                  </div>
                  <ul className="pl-2">
                    {object?.childrens?.map((child: any, idx: any) => {
                      return (
                        <li key={idx}>
                          <div
                            onClick={(e) => {
                              clickedObjectDetails(e, child);
                            }}
                            onContextMenu={(e) => {
                              showContextMenu(e, child);
                            }}
                            className="flex items-center px-2 py-1 text-base font-medium text-[#344054] rounded-lg"
                          >
                            {child.icon === "sphere" ? (
                              <MyIcon name="sphere" />
                            ) : child.icon === "cube" ? (
                              <MyIcon name="cube" />
                            ) : child.icon === "cylinder" ? (
                              <MyIcon name="cylinder" />
                            ) : child.icon === "mesh" ? (
                              <MyIcon name="mesh" />
                            ) : null}
                            <input
                              type="text"
                              disabled={!child.editable}
                              className="w-full py-1 mx-1 px-1 bg-transparent focus:outline-black rounded"
                              value={child.name}
                              onChange={(e) => changeName(e, child)}
                              onKeyUp={(e) => {
                                if (e.keyCode === 13)
                                  setEditable(e, child, false);
                              }}
                              onBlur={(e) => {
                                setEditable(e, child, false);
                              }}
                            />
                            <button onClick={(e) => toggleVisibility(e, child)}>
                              {child.visible ? (
                                <MyIcon name="eye-open" />
                              ) : (
                                <MyIcon name="eye-close" />
                              )}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </li>
            ) : 
*/

/*  const createComponent = (e: any, clickedObject: any) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      let idx = items.findIndex((object) => object.id === clickedObject.id);
      if (idx >= 0) {
        let newComponent = {
          id: Date.now().toString(),
          name: "Component",
          icon: null,
          editable: null,
          visible: null,
          material: clickedObject.material,
          childrens: [clickedObject],
        };
        let newObjects = items.filter(
          (object) => object.id !== clickedObject.id
        );
        setItems([...newObjects, newComponent]);
      } else {
        alert("Already in a component!");
      }
    } else {
      let canCreate = true;
      selectedItems.map((selectedObject) => {
        if (selectedObject.name === "Component") {
          canCreate = false;
        } else {
          let idx = items.findIndex(
            (object) => object.id === selectedObject.id
          );
          if (idx < 0) {
            canCreate = false;
          }
        }
      });
      if (canCreate) {
        // create component with selected objects
        let material = selectedItems[0].material;
        selectedItems.forEach((selectedObject) => {
          if (selectedObject.material !== material) {
            material = null;
          }
        });
        let newComponent = {
          id: Date.now().toString(),
          name: "Component",
          icon: null,
          editable: null,
          visible: null,
          material: material,
          childrens: selectedItems,
        };
        let newObjects = items.filter(
          (object) =>
            !selectedItems.some(
              (selectedObject) => selectedObject.id === object.id
            )
        );
        setItems([...newObjects, newComponent]);
      } else {
        alert("Selected any contianer or conainter's shape!");
      }
    }
  }; */
