import * as BABYLON from "babylonjs";

export function createBabylonScene(
  canvas: HTMLCanvasElement,
  engine: BABYLON.Engine
): BABYLON.Scene {
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
  });
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
  scene.autoClear = false;
  scene.autoClearDepthAndStencil = false;
  scene.blockMaterialDirtyMechanism = true;
  scene.useRightHandedSystem = true;

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 3.5,
    Math.PI / 2.7,
    160,
    BABYLON.Vector3.Zero(),
    scene
  );

  camera.zoomToMouseLocation = true;
  camera.wheelDeltaPercentage = 0.05;
  camera.inertia = 0;
  camera.panningInertia = 0;
  camera.angularSensibilityX = 250;
  camera.angularSensibilityY = 250;
  camera.allowUpsideDown = true;
  camera.lowerBetaLimit = null; //0.01;
  camera.upperBetaLimit = null; //2 * Math.PI - 0.01;
  camera.setTarget(BABYLON.Vector3.Zero());
  camera.attachControl(canvas, true);

  canvas.addEventListener("keydown", (event) => {
    if (event.shiftKey) {
      camera._panningMouseButton = 0;
    }
  });
  canvas.addEventListener("keyup", (event) => {
    if (!event.shiftKey) {
      camera._panningMouseButton = 2;
    }
  });

  setCamera(camera);

  // Key Light
  const keyLight = new BABYLON.DirectionalLight(
    "keyLight",
    new BABYLON.Vector3(0, -1, 1),
    scene
  );
  keyLight.intensity = 0.7;

  // Fill Light
  const fillLight = new BABYLON.HemisphericLight(
    "fillLight",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );
  fillLight.intensity = 0.5;
  fillLight.diffuse = new BABYLON.Color3(0.6, 0.6, 0.6);
  fillLight.specular = new BABYLON.Color3(0.5, 0.5, 0.5);

  // Underneath Fill Light
  const fillLightUnderneath = new BABYLON.HemisphericLight(
    "fillLightUnderneath",
    new BABYLON.Vector3(0, -1, 0),
    scene
  );
  fillLightUnderneath.intensity = 0.5;
  fillLightUnderneath.diffuse = new BABYLON.Color3(0.6, 0.6, 0.6);
  fillLightUnderneath.specular = new BABYLON.Color3(0.5, 0.5, 0.5);

  // Back Light
  const backLight = new BABYLON.PointLight(
    "backLight",
    new BABYLON.Vector3(-100, 100, -100),
    scene
  );
  backLight.intensity = 0.5;

  // Set the position of the key light
  function setLightPositionByAngle(
    light: BABYLON.DirectionalLight,
    angle: any,
    distance: any,
    height: any
  ) {
    const x = Math.cos((angle * Math.PI) / 180) * distance;
    const z = Math.sin((angle * Math.PI) / 180) * distance;
    light.position = new BABYLON.Vector3(x, height, z);
    light.setDirectionToTarget(BABYLON.Vector3.Zero());
  }

  setLightPositionByAngle(keyLight, 120, 50, 100);

  return scene;
}

function setCamera(camera: BABYLON.ArcRotateCamera) {
  if (camera.framingBehavior) {
    camera.framingBehavior.framingTime = 1000;
    camera.framingBehavior.zoomStopsAnimation = true;
    camera.framingBehavior.radiusScale = 1.5;
    camera.framingBehavior.positionScale = 0.5;
    camera.framingBehavior.defaultElevation = 0.3;
    camera.framingBehavior.elevationReturnTime = 1500;
    camera.framingBehavior.elevationReturnWaitTime = 1000;
    camera.framingBehavior.framingTime = 1000;
  }
  camera.lowerRadiusLimit = 1;
  camera.upperRadiusLimit = 500;
  camera.wheelPrecision = 10;
  camera.panningSensibility = 10;
  camera.pinchPrecision = 100;
}

export function frameCamera(
  radius: any = 1.5,
  mesh: BABYLON.Mesh,
  scene: BABYLON.Scene
) {
  if (!scene.activeCamera) return;
}
