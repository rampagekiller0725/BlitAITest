import React from "react";
import MyIcon from "../../../../assets/MyIcons";

interface SidebarItemHeaderProps {
  itemType: string;
  objCounter: number;
  onCollapseToggle: () => void;
  isCollapsed: boolean;
}

const SidebarItemHeader = ({
  itemType,
  objCounter,
  onCollapseToggle,
  isCollapsed,
}: SidebarItemHeaderProps) => {
  return (
    <div
      className="bg-[#EAECF0] flex items-center px-2 py-0.5 text-sm font-normal text-[#101828] rounded-lg"
      onClick={onCollapseToggle}
    >
      {/* Icon */}
      {itemType === "Objects" ? (
        <MyIcon name="3d-cube" />
      ) : itemType === "Ports" ? (
        <MyIcon name="ports" />
      ) : itemType === "Lumped Elements" ? (
        <MyIcon name="lumped-elements" />
      ) : null}

      {/* Text area */}
      {itemType === "Objects" ? (
        <span className="ml-3 font-bold text-base">Objects</span>
      ) : itemType === "Ports" ? (
        <span className="ml-3 font-bold text-base">Ports</span>
      ) : itemType === "Lumped Elements" ? (
        <span className="ml-3 font-bold text-base">Lumped&nbsp;elements</span>
      ) : null}

      {/* Items Counter */}
      <div className="w-full flex justify-end">
        <span className="inline-flex justify-center items-center p-3 ml-3 w-2 h-2 text-xs font-medium bg-[#DEE2E8] text-[#344054] rounded-full">
          {objCounter}
        </span>
      </div>

      {/* Right Arrow */}
      <div
        className={`w-3 h-3 m-1 ml-2 transform transition-transform duration-500 ${
          isCollapsed ? "" : "rotate-90"
        }`}
      >
        <MyIcon name="right-arrow" color="#667085" />
      </div>
    </div>
  );
};

export default SidebarItemHeader;
