import Port from "./port";
import Element from "./element";
import Sphere from "./sphere";
import Cylinder from "./cylinder";
import Cube from "./cube";

type Geometry = {
  object: Port | Element | Sphere | Cylinder | Cube;
};

export default Geometry;
