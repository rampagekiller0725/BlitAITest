import { createSlice, original } from "@reduxjs/toolkit";
import { RootState } from "..";
import Geometry from "components/project-components/babylonjs/types/geometry";

enum Status {
  Added = "Added",
  Altered = "Altered",
  Completed = "Completed",
  Removed = "Removed",
}

export type Model = {
  id: string;
  number: string;
  name: string;
  type: string;
  selected: boolean;
  object?: Geometry;
  status: Status;
  icon: string;
  editable: boolean;
  visible: boolean;
  material: string;
  childrens?: any[];
  category: "Objects" | "Ports" | "Lumped Elements";
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: {
    x: number;
    y: number;
    z: number;
  };
  scaling: {
    x: number;
    y: number;
    z: number;
  };
};

let initialModels: Model[] = [];
let initialSavedModels: Model[] = [];
let initialFirstSelected: undefined | string = undefined;

const initialState = {
  models: initialModels,
  savedModels: initialSavedModels,
  firstSelected: initialFirstSelected,
};

const modelSlice = createSlice({
  name: "models",
  initialState,
  reducers: {
    modelAdded(state, action) {
      state.models.push(action.payload);
    },
    modelSaved(state, action) {
      state.savedModels.splice(0, state.savedModels.length);
      state.savedModels.push(action.payload);
    },
    modelAltered(state, action) {
      const id = action.payload.id;
      let index = state.models.findIndex((model) => model.id === id);
      let model = action.payload;
      if (model) {
        state.models[index] = Object.assign(model);
      }
    },
    modelCompleted(state, action) {
      const id = action.payload;
      let index = state.models.findIndex((model) => model.id === id);
      let model = original(state.models[index]);
      if (model) {
        const alteredModel = {
          ...model,
          status: Status.Completed,
        };
        state.models[index] = Object.assign(alteredModel);
      }
    },
    modelRemoved(state, action) {
      const id = action.payload;
      let index = state.models.findIndex((model) => model.id === id);
      let model = original(state.models[index]);
      if (model) {
        const removedModel = {
          ...model,
          status: Status.Removed,
        };
        state.models[index] = Object.assign(removedModel);
      }
    },
    modelRemovedFromScene(state, action) {
      state.models = state.models.filter(
        (model) => model.id !== action.payload
      );
    },
    setFirstSelected(state, action) {
      state.firstSelected = action.payload;
    },
  },
});

export const selectModels = (state: RootState) => state.models.models;
export const selectSavedModels = (state: RootState) => state.models.savedModels;
export const selectFirstSelected = (state: RootState) =>
  state.models.firstSelected;

export const {
  modelAdded,
  modelSaved,
  modelAltered,
  modelCompleted,
  modelRemoved,
  modelRemovedFromScene,
  setFirstSelected,
} = modelSlice.actions;

export default modelSlice.reducer;
