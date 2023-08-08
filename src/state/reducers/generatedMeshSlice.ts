import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface GeneratedMesh {
  mesh: any,
  meshXY: any,
  meshYZ: any,
  meshXZ: any,
}

const initialState: GeneratedMesh = {
  mesh: undefined,
  meshXY: [],
  meshYZ: [],
  meshXZ: [],
};

const generatedMeshSlice = createSlice({
  name: "generatedMesh",
  initialState,
  reducers: {
    setMesh(state, action) {
      state.mesh = action.payload;
    },
    setMeshXY(state, action) {
      state.meshXY = action.payload;
    },
    setMeshYZ(state, action) {
      state.meshYZ = action.payload;
    },
    setMeshXZ(state, action) {
      state.meshXZ = action.payload;
    }
  },
});

export const selectGeneratedMesh = (state: RootState) => state.generatedMeshSlice.mesh;
export const selectGeneratedMeshXY = (state: RootState) => state.generatedMeshSlice.meshXY;
export const selectGeneratedMeshXZ = (state: RootState) => state.generatedMeshSlice.meshXZ;
export const selectGeneratedMeshYZ = (state: RootState) => state.generatedMeshSlice.meshYZ;

export const { setMesh, setMeshXY, setMeshYZ, setMeshXZ } = generatedMeshSlice.actions;

export default generatedMeshSlice.reducer;
