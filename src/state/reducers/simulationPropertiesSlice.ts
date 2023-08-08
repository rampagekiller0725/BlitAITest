import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

let initialState = {
  properties: {
    f_min: 1000000000,
    f_max: 3000000000,
    excitation: "sequential",
    pml_n: 8,
    end_criteria: -40,
    farfield: 2400000000,
    e_field: 2400000000,
    h_field: 2400000000,
    cpw_min: 500,
    cpw_far: 20,
    cpw_near: 40,
  },
};

const simulationPropertiesSlice = createSlice({
  name: "simulationProperties",
  initialState: initialState,
  reducers: {
    updateSimulationProperties(state, action) {
      state.properties = Object.assign(action.payload);
    },
  },
});

export const selectSimulationProperties = (state: RootState) =>
  state.simulationProperties.properties;

export const { updateSimulationProperties } = simulationPropertiesSlice.actions;

export default simulationPropertiesSlice.reducer;
