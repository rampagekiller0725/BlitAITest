export const showMeshes = (
  targetMeshName: string,
  mainScene: BABYLON.Scene
) => {
  mainScene.meshes.forEach((mesh: any) => {
    if (mesh.name === targetMeshName) {
      mesh.visibility = 1;
    }
  });
};

export const hideMeshes = (
  targetMeshName: string,
  mainScene: BABYLON.Scene
) => {
  mainScene.meshes.forEach((mesh: any) => {
    if (mesh.name === targetMeshName) {
      mesh.visibility = 0;
    }
  });
};
