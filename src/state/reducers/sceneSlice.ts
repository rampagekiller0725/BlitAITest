import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";

import * as BABYLON from "babylonjs";
import "babylonjs-loaders";

let canvas = document.querySelectorAll("canvas")[0];

let initialScene: BABYLON.Scene | undefined;
let pos: any = { x: undefined, y: undefined, z: undefined };

if (canvas) {
  initialScene = new BABYLON.Scene(new BABYLON.Engine(canvas));
}

const initialState = {
  scene: initialScene,
  isSceneClickable: false,
  pickedPos: pos,
};

const sceneSlice = createSlice({
  name: "scene",
  initialState,
  reducers: {
    sceneEmpty(state, action) {
      if (state.scene && state.scene.meshes.length === 0) {
        console.log("Scene is empty.");
      }
    },
    setSceneClickable(state, action) {
      state.isSceneClickable = action.payload;
    },
    setPickedPos(state, action) {
      state.pickedPos = action.payload;
    },
  },
});

export const selectScene = (state: RootState) => state.scene;
export const isSceneClickable = (state: RootState) =>
  state.scene.isSceneClickable;
export const selectPickedPos = (state: RootState) => state.scene.pickedPos;

export const { sceneEmpty, setSceneClickable, setPickedPos } =
  sceneSlice.actions;

export default sceneSlice.reducer;
