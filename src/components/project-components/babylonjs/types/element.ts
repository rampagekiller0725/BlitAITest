type Element = {
  //number: number,
  element_type: string;
  resistance: number;
  inductance: number;
  capacitance: number;
  x: {
    min: number;
    max: number;
  };
  y: {
    min: number;
    max: number;
  };
  z: {
    min: number;
    max: number;
  };
};

export default Element;
