import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

const initialState = {
  selectedGraph: "s-parameters",
  isVSWREnabled: true,
  isImpedanceEnabled: true,
  isPattern3DEnabled: false,
  isEFieldEnabled: false,
  isHFieldEnabled: false,
};

const selectedGraphSlice = createSlice({
  name: "selectedGraph",
  initialState,
  reducers: {
    updateSelectedGraph(state, action) {
      const selectedGraphName = action.payload;
      state.selectedGraph = selectedGraphName;
    },
    setVSWREnabled(state, action) {
      state.isVSWREnabled = action.payload;
    },
    setImpedanceEnabled(state, action) {
      state.isImpedanceEnabled = action.payload;
    },
    setPattern3DEnabled(state, action) {
      state.isPattern3DEnabled = action.payload;
    },
    setEFieldEnabled(state, action) {
      state.isEFieldEnabled = action.payload;
    },
    setHFieldEnabled(state, action) {
      state.isHFieldEnabled = action.payload;
    },
  },
});

export const selectGraph = (state: RootState) => state.selectedGraph;
export const selectIsVSWREnabled = (state: RootState) =>
  state.selectedGraph.isVSWREnabled;
export const selectIsImpedanceEnabled = (state: RootState) =>
  state.selectedGraph.isImpedanceEnabled;
export const selectIsPattern3DEnabled = (state: RootState) =>
  state.selectedGraph.isPattern3DEnabled;
export const selectIsEFieldEnabled = (state: RootState) =>
  state.selectedGraph.isEFieldEnabled;
export const selectIsHFieldEnabled = (state: RootState) =>
  state.selectedGraph.isHFieldEnabled;

export const {
  updateSelectedGraph,
  setVSWREnabled,
  setImpedanceEnabled,
  setPattern3DEnabled,
  setEFieldEnabled,
  setHFieldEnabled,
} = selectedGraphSlice.actions;

export default selectedGraphSlice.reducer;
