import React, { useState, useRef, useEffect } from "react";
import SidebarHeader from "./sidebar/SidebarHeader";
import SidebarItemList from "./sidebar/SidebarBody/SidebarItemList";
import SidebarFooter from "./sidebar/SidebarFooter";
import { useAppDispatch, useAppSelector } from "state/hooks";
import {
  selectSavedModels,
  modelAdded,
  selectModels,
} from "state/reducers/modelSlice";
import { Item } from "models/Item";
import SidebarBody from "./sidebar/SidebarBody";
import { useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import MeshProperties from "./sidebar/SidebarBody/MeshProperties";

export interface SidebarProps {
  scene: BABYLON.Scene;
  items: Item[];
  selectedItems: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<Item[]>>;
}

function Sidebar({
  scene,
  items,
  setItems,
  selectedItems,
  setSelectedItems,
}: SidebarProps) {
  const { projectId } = useParams();
  const [pastePos, setPastePos] = useState({ x: 0, y: 0 });
  var pastedCnt = useRef(1);

  const dispatch = useAppDispatch();
  const savedModels = useAppSelector(selectSavedModels);
  const models = useAppSelector(selectModels);

  const getElementNumber = () => {
    let elementLength = 0;
    for(let i = 0; i < models.length; i ++)
      if(models[i].type == "element")
        elementLength ++;
    for (let i = 0; i < models.length; i++) {
      let f = false;
      for (let j = 0; j < models.length; j++) {
        if (models[j].type == "element") {
          if (models[j]?.number == (i + 1).toString()) {
            f = true;
            break;
          }
        }
      }
      if (f == false) return i + 1;
    }
    return elementLength + 1;
  };

  const getPortNumber = () => {
    let portLength = 0;
    for(let i = 0; i < models.length; i ++)
      if(models[i].type == "port")
        portLength ++;
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

  useEffect(() => {
    pastedCnt.current = 1;
  }, [savedModels]);

  const showContextMenu = (e: any) => {
    e.preventDefault();
    if (savedModels.length === 0) return;
    let contextMenu: any = document.getElementById("context-menu");

    contextMenu.style.display = "initial";
    contextMenu.style.top = e.pageY + "px";
    contextMenu.style.left = e.pageX + "px";
    setPastePos({ x: e.pageX, y: e.pageY });
  };

  const hideContextMenu = () => {
    let contextMenu: any = document.getElementById("context-menu");
    contextMenu.style.display = "none";
  };

  const pasteSavedModel = () => {
    hideContextMenu();
    var obj;
    var savedModelsObj:any = savedModels[0].object;
    if(savedModels[0].type == "element") {
      obj = {
        ...savedModels[0],
        number: getElementNumber(),
        name: "Element " + getElementNumber() + " (R: " + savedModelsObj.resistance + " Ω, L: " + savedModelsObj.inductance + " H, C: " + savedModelsObj.capacitance + " F)",
        id: uuid(),
        selected: false,
        status: "Added",
      };
    } else if(savedModels[0].type == "port") {
      obj = {
        ...savedModels[0],
        number: getPortNumber(),
        name: "Port " + getPortNumber() + " ("  + savedModelsObj.impedance + " Ω)",
        id: uuid(),
        selected: false,
        status: "Added",
      };
    } else {
      obj = {
        ...savedModels[0],
        name: savedModels[0].name + "_" + pastedCnt.current,
        id: uuid(),
        selected: false,
        status: "Added",
      };
      pastedCnt.current += 1;
    }
    dispatch(modelAdded(obj));
  };

  return (
    <aside className="font-inter h-full touch-auto w-full" aria-label="Sidebar">
      <div
        className="flex flex-col justify-between h-screen py-4 px-3 bg-white border-0 border-r-2 border-[#EAECF0]"
        onContextMenu={showContextMenu}
        onClick={hideContextMenu}
      >
        <div>
          <SidebarHeader />
          <SidebarBody
            scene={scene}
            items={items}
            selectedItems={selectedItems}
            setItems={setItems}
            setSelectedItems={setSelectedItems}
            pasteSavedModel={pasteSavedModel}
          />
        </div>
        <div>
          <SidebarFooter projectId={projectId ?? ""} />
        </div>
        <div
          id="context-menu"
          className="absolute z-30 w-44 bg-white rounded divide-y divide-gray-100 shadow"
        >
          <ul className="py-2 text-sm text-gray-700 text-left px-2">
            <li>
              <button
                onClick={pasteSavedModel}
                className="block rounded text-left w-full px-4 hover:bg-gray-100"
              >
                Paste
              </button>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
