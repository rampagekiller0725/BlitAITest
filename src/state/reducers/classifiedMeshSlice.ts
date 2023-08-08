import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface ClassifiedMesh {
  classification: any;
}

const initialState: ClassifiedMesh = {
  classification: undefined,
};

const classifiedMeshSlice = createSlice({
  name: "classifiedMesh",
  initialState,
  reducers: {
    setClassification(state, action) {
      state.classification = action.payload;
    },
  },
});

export const selectClassifiedMesh = (state: RootState) =>
  state.classifiedMeshSlice.classification;

export const { setClassification } = classifiedMeshSlice.actions;

export default classifiedMeshSlice.reducer;
