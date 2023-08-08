import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

interface ProjectInfo {
  info: {
    project_name: string;
    frequency_range: string;
    latestVersion: string;
    percentage: number;
    status: string;
    type: string;
  };
}

const initialState: ProjectInfo = {
  info: {
    project_name: "New project",
    frequency_range: "",
    latestVersion: "",
    percentage: 0,
    status: "Idle",
    type: "3D-Simulation",
  },
};

const projectInfoSlice = createSlice({
  name: "projectInfo",
  initialState,
  reducers: {
    setProjectInfo(state, action) {
      state.info = Object.assign(action.payload);
    },
  },
});

export const selectProjectInfo = (state: RootState) => state.projectInfoSlice;
export const { setProjectInfo } = projectInfoSlice.actions;

export default projectInfoSlice.reducer;
