import { useSelector } from "react-redux";
import { selectTab } from "state/reducers/selectedTabSlice";
import MeshProperties from "./SidebarBody/MeshProperties";
import SidebarItem from "./SidebarBody/SidebarItem";
import Statistics from "./SidebarBody/Statistics";
import { useParams } from "react-router-dom";

interface SidebarBodyProps {
  scene: BABYLON.Scene;
  items: any[];
  selectedItems: any[];
  setItems: React.Dispatch<React.SetStateAction<any[]>>;
  setSelectedItems: React.Dispatch<React.SetStateAction<any[]>>;
  pasteSavedModel: any;
}

const SidebarBody = ({
  scene,
  items,
  selectedItems,
  setItems,
  setSelectedItems,
  pasteSavedModel,
}: SidebarBodyProps) => {
  const { selectedTab } = useSelector(selectTab);
  const { projectId } = useParams();

  return (
    <div>
      {selectedTab === 0 ? (
        <div className="overflow-y-auto ">
          <SidebarItem
            scene={scene}
            itemType="Objects"
            items={items}
            selectedItems={selectedItems}
            setItems={setItems}
            setSelectedItems={setSelectedItems}
            pasteSavedModel={pasteSavedModel}
          />

          <SidebarItem
            scene={scene}
            itemType="Ports"
            items={items}
            selectedItems={selectedItems}
            setItems={setItems}
            setSelectedItems={setSelectedItems}
            pasteSavedModel={pasteSavedModel}
          />
          <SidebarItem
            scene={scene}
            itemType="Lumped Elements"
            items={items}
            selectedItems={selectedItems}
            setItems={setItems}
            setSelectedItems={setSelectedItems}
            pasteSavedModel={pasteSavedModel}
          />
        </div>
      ) : selectedTab === 1 ? (
        <div className="overflow-y-auto ">
          <MeshProperties projectId={projectId ?? ""} />
        </div>
      ) : (
        <div className="overflow-y-auto ">
          <Statistics projectId={projectId ?? ""} />
        </div>
      )}
    </div>
  );
};

export default SidebarBody;
