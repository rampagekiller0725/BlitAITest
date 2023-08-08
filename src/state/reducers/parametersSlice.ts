import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "state";

interface Parameter {
  id: string;
  name: string;
  expression: string;
  value: string;
  description: string;
}

interface Parameters {
  parameters: Array<Parameter>;
}

const initialState: Parameters = {
  parameters: [],
};

const parametersSlice = createSlice({
  name: "parameters",
  initialState,
  reducers: {
    addParameter(state, action) {
      state.parameters.push(action.payload);
    },
    editParameter(state, action) {
      for (let i = 0; i < state.parameters.length; i++) {
        if (state.parameters[i].id === action.payload.id) {
          state.parameters[i] = {
            ...state.parameters[i],
            name: action.payload.name,
            expression: action.payload.expression,
            value: action.payload.value,
            description: action.payload.description,
          };
          return;
        }
      }
    },
    deleteParameter(state, action) {
      for (let i = 0; i < state.parameters.length; i++) {
        if (state.parameters[i].id === action.payload) {
          state.parameters.splice(i, 1);
          return;
        }
      }
    },
  },
});
export const selectParameters = (state: RootState) =>
  state.parameters.parameters;

export const { addParameter, editParameter, deleteParameter } =
  parametersSlice.actions;
export default parametersSlice.reducer;
