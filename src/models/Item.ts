export interface Item {
  id: string;
  type?: string;
  name: string;
  icon: string;
  editable: boolean;
  visible: boolean;
  material: string;
  childrens?: any[];
  category: "Objects" | "Ports" | "Lumped Elements";
  selected: boolean;
}
