import * as React from "react";
import { useEffect, useState } from "react";
import MaterialMenu from "./MaterialMenu";
import {
  Model,
  modelAdded,
  modelRemoved,
  modelSaved,
  selectSavedModels,
} from "state/reducers/modelSlice";
import { useAppDispatch, useAppSelector } from "state/hooks";

export interface IContextMenuProps {
  menuPosition: { x: number; y: number };
  models: Model[];
  clickedObject: Model;
  // selectAll: (e: any, clickedObject: Item) => void;
  setEditable: (e: any, clickedObject: Model, status: boolean) => void;
  // setMaterial: (e: any, clickedObject: Item, material: string) => void;
  // createComponent: (e: any, clickedObject: any) => void;
  // deleteObject: (e: any, clickedObject: Item) => void;
  exportObject: (e: any, clickedObject: Model) => void;
  isMultiSelect: boolean;
  showPropertyMenu: (e: any, type: string) => void;
  pasteSavedModel: any;
}

function ContextMenu({
  menuPosition,
  models,
  clickedObject,
  setEditable,
  // setMaterial,
  // selectAll,
  // createComponent,
  // deleteObject,
  exportObject,
  isMultiSelect,
  showPropertyMenu,
  pasteSavedModel,
}: IContextMenuProps) {
  const [, setIsComponent] = useState(false);
  const [, setIsComponentChild] = useState(false);
  const [showSubMenu, setShowSubMenu] = useState(false);

  const dispatch = useAppDispatch();
  const savedModels = useAppSelector(selectSavedModels);

  useEffect(() => {
    setIsComponent(false);
    setIsComponentChild(false);
    setShowSubMenu(false);

    if (clickedObject.name === "Component") {
      setIsComponent(true);
    } else {
      let idx = models.findIndex((object) => object.id === clickedObject.id);
      if (idx < 0) {
        setIsComponentChild(true);
      }
    }
  }, [menuPosition, clickedObject.id, clickedObject.name, models]);

  const saveObject = (e: any, clickedObject: Model) => {
    dispatch(modelSaved(clickedObject.id));
  };

  const deleteObject = (e: any, clickedObject: Model) => {
    dispatch(modelRemoved(clickedObject.id));
  };

  return (
    <>
      {models.length > 0 && (
        <div
          style={{ left: menuPosition.x, top: menuPosition.y }}
          className="absolute z-30 w-44 bg-white rounded divide-y divide-gray-100 shadow"
        >
          <ul className="py-4 text-sm text-gray-700 text-left px-2">
            {/* Rename Button */}
            {models[0].category === "Objects" && !isMultiSelect ? (
              <li>
                <button
                  onClick={(e) => {
                    setEditable(e, clickedObject, true);
                  }}
                  className="block rounded text-left w-full py-2 px-4 hover:bg-gray-200"
                >
                  Rename
                </button>
              </li>
            ) : null}
            {/* Material Menu */}
            {models[0] && models[0].category === "Objects" ? (
              <li>
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  onMouseEnter={(e) => {
                    setShowSubMenu(true);
                  }}
                  onMouseLeave={(e) => {
                    setShowSubMenu(false);
                  }}
                  style={{ cursor: "pointer" }}
                  className="flex justify-between items-center py-2 px-4 w-full hover:bg-gray-200"
                >
                  Material
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  {showSubMenu && (
                    <MaterialMenu
                      isMultiSelect={isMultiSelect}
                      models={models}
                    />
                  )}
                </div>
              </li>
            ) : null}
            {/* Create Component Button */}
            {/* {!isComponent && !isComponentChild && (
          <li>
            <button
              onClick={(e) => {
                createComponent(e, clickedObject);
              }}
              className="block w-full rounded text-left py-2 px-4 hover:bg-gray-100"
            >
              Create Component
            </button>
          </li>
        )} */}
            {/* Export button */}
            {/* <li>
          <button
            onClick={(e) => {
              exportObject(e, clickedObject);
            }}
            className="block w-full rounded text-left py-2 px-4"
          >
            Export
          </button>
        </li> */}
            {/* Coopy button */}
            <li>
              <button
                onClick={(e) => {
                  if (isMultiSelect) {
                    return;
                  } else {
                    dispatch(modelSaved(clickedObject));
                  }
                }}
                className="block w-full rounded text-left py-2 px-4 hover:bg-gray-200"
              >
                Copy
              </button>
            </li>
            {/* Paste button */}
            {savedModels.length > 0 && (
              <li>
                <button
                  onClick={(e) => {
                    if (isMultiSelect) {
                      return;
                    } else {
                      pasteSavedModel();
                    }
                  }}
                  className="block w-full rounded text-left py-2 px-4 hover:bg-gray-200"
                >
                  Paste
                </button>
              </li>
            )}
            {/* Properties button */}
            {clickedObject.type !== "mesh" &&
              clickedObject.type !== "mergedMesh" &&
              !isMultiSelect && (
                <li>
                  <button
                    onClick={(e) => {
                      if (isMultiSelect) {
                        return;
                      } else {
                        showPropertyMenu(e, clickedObject.type);
                      }
                    }}
                    className="block w-full rounded text-left py-2 px-4 hover:bg-gray-200"
                  >
                    Properties
                  </button>
                </li>
              )}
            {/* Delete button */}
            <li>
              <button
                onClick={(e) => {
                  if (isMultiSelect) {
                    const toBeDeletedModels = models.filter(
                      (model) => model.selected === true
                    );
                    toBeDeletedModels.forEach((model) => {
                      deleteObject(e, model);
                    });
                  } else {
                    deleteObject(e, clickedObject);
                  }
                }}
                className="block w-full rounded text-left py-2 px-4 hover:bg-red-400"
              >
                Delete
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

export default ContextMenu;

/* Create Component Button */

/* {!isComponent && !isComponentChild && (
          <li>
            <button
              onClick={(e) => {
                createComponent(e, clickedObject);
              }}
              className="block w-full rounded text-left py-2 px-4 hover:bg-gray-100"
            >
              Create Component
            </button>
          </li>
        )} */

/* {!isComponent ? (
          <li>
            <button
              onClick={(e) => {
                setEditable(e, clickedObject, true);
              }}
              className="block rounded text-left w-full py-2 px-4 hover:bg-gray-100"
            >
              Rename
            </button>
          </li>
        ) : (
          <li>
            <button
              onClick={(e) => {
                selectAll(e, clickedObject);
              }}
              className="block rounded text-left w-full py-2 px-4 hover:bg-gray-100"
            >
              Select All
            </button>
          </li>
        )} */
