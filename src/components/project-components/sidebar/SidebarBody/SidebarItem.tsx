import React, { useState } from "react";
import { useAppSelector } from "state/hooks";
import { selectModels } from "state/reducers/modelSlice";

import SidebarItemHeader from "./SidebarItemHeader";
import SidebarItemList from "./SidebarItemList";
import SidebarItemFooter from "./SidebarItemFooter";

import "./SidebarItem.css";

interface SidebarItemProps {
  scene: BABYLON.Scene;
  itemType: string;
  items: any[];
  selectedItems: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
  pasteSavedModel: any;
}

const SidebarItem = ({
  scene,
  itemType,
  items,
  selectedItems,
  setItems,
  setSelectedItems,
  pasteSavedModel,
}: SidebarItemProps) => {
  const models = useAppSelector(selectModels);
  const modelsToDraw = Object.values(models);
  const arrayModel = modelsToDraw.flat();

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCollapseToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="my-2 space-y-1 bg-[#F9FAFB] rounded-md p-2">
      <SidebarItemHeader
        itemType={itemType}
        objCounter={
          arrayModel.filter((model) => model.category === itemType).length
        }
        onCollapseToggle={handleCollapseToggle}
        isCollapsed={isCollapsed}
      />
      <SidebarItemList
        scene={scene}
        models={arrayModel.filter((model) => model.category === itemType)}
        objCounter={
          arrayModel.filter((model) => model.category === itemType).length
        }
        pasteSavedModel={pasteSavedModel}
        isCollapsed={isCollapsed}
      />
      <SidebarItemFooter
        itemType={itemType}
        objCounter={
          arrayModel.filter((model) => model?.category === itemType).length
        }
      />
    </div>
  );
};

export default SidebarItem;
