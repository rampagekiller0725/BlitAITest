import authSlice from "./authSlice";
import generatedMeshSlice from "./generatedMeshSlice";
import classifiedMeshSlice from "./classifiedMeshSlice";
import modelSlice from "./modelSlice";
import projectInfoSlice from "./projectInfoSlice";
import sceneSlice from "./sceneSlice";
import selectedGraphSlice from "./selectedGraphSlice";
import selectedTabSlice from "./selectedTabSlice";
import simulationPropertiesSlice from "./simulationPropertiesSlice";
import parametersSlice from "./parametersSlice";

const reducers = {
  models: modelSlice,
  scene: sceneSlice,
  selectedTab: selectedTabSlice,
  simulationProperties: simulationPropertiesSlice,
  authSlice: authSlice,
  selectedGraph: selectedGraphSlice,
  generatedMeshSlice: generatedMeshSlice,
  classifiedMeshSlice: classifiedMeshSlice,
  projectInfoSlice: projectInfoSlice,
  parameters: parametersSlice,
};

export default reducers;
