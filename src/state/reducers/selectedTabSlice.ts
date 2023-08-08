import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

const initialState = {
  selectedTab: 0,
};

const selectedTabSlice = createSlice({
  name: "selectedTab",
  initialState,
  reducers: {
    updateSelectedTab(state, action) {
      const selectedTabId = action.payload;
      state.selectedTab = selectedTabId;
    },
  },
});

export const selectTab = (state: RootState) => state.selectedTab;

export const { updateSelectedTab } = selectedTabSlice.actions;

export default selectedTabSlice.reducer;
