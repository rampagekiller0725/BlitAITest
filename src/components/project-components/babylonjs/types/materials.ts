type Materials = {
  [key: string]: {
    color: string;
    epsilon?: number;
    kappa?: number;
    mu?: number;
  };
};

export default Materials;
