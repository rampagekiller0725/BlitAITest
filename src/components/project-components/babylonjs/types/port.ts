type Port = {
  //number: number,
  impedance: number;
  amplitude: number;
  phase_shift: number;
  f_ref: number;
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

export default Port;
