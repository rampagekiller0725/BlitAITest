import * as BABYLON from "babylonjs";
import { NormalMaterial } from "babylonjs-materials";

export function createAxisViewScene(
  canvas: HTMLCanvasElement,
  engine: BABYLON.Engine
): BABYLON.Scene {
  const scene = new BABYLON.Scene(engine);
  scene.autoClear = false;
  scene.autoClearDepthAndStencil = true;
  scene.blockMaterialDirtyMechanism = true;
  scene.useRightHandedSystem = true;

  const ambient = new BABYLON.HemisphericLight(
    "ambient",
    new BABYLON.Vector3(0, -1, 0),
    scene
  );
  ambient.diffuse = new BABYLON.Color3(1, 1, 1);
  ambient.groundColor = new BABYLON.Color3(1, 1, 1);
  ambient.intensity = 1;

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    0,
    0,
    10,
    BABYLON.Vector3.Zero(),
    scene
  );
  camera.allowUpsideDown = true;
  camera.lowerBetaLimit = null; //0.01;
  camera.upperBetaLimit = null; //2 * Math.PI - 0.01;

  camera.viewport = updateViewport(200, 200, 0, 0, canvas);
  camera.radius = 4.5;

  const cube = BABYLON.MeshBuilder.CreateBox("viewcube", { size: 1 }, scene);
  cube.material = new NormalMaterial("viewcube", scene);
  cube.edgesWidth = 0;
  cube.edgesColor = BABYLON.Color4.FromHexString("#00000090");
  cube.enableEdgesRendering();
  cube.material.backFaceCulling = true;
  cube.material.alpha = 0;
  cube.material.freeze();
  cube.doNotSyncBoundingInfo = true;

  cube.convertToUnIndexedMesh(); // after edgesRendering
  cube.freezeWorldMatrix();
  cube.freezeNormals();

  var size = 10;
  var position = 1.3;

  var makeTextPlane = function (text: any, color: any, size: any) {
    const plane = BABYLON.MeshBuilder.CreatePlane(
      "TextPlane",
      {
        size: size,
        updatable: true,
      },
      scene
    );

    var dynamicTexture = new BABYLON.DynamicTexture(
      "dynamic texture",
      400,
      scene
    );
    dynamicTexture.hasAlpha = true;

    var materialGround = new BABYLON.StandardMaterial("Mat", scene);
    materialGround.diffuseTexture = dynamicTexture;
    plane.material = materialGround;
    plane.material.backFaceCulling = false;

    var font = "bold 200px Inter";
    dynamicTexture.drawText(
      text,
      180,
      200,
      font,
      color,
      "transparent",
      false,
      true
    );

    return plane;
  };

  var xChar = makeTextPlane("X", "red", size / 10);
  xChar.position = new BABYLON.Vector3(0.95 * position, 0.125 * position, 0);

  var yChar = makeTextPlane("Y", "green", size / 10);
  yChar.position = new BABYLON.Vector3(-0.095 * position, 0.95 * position, 0);
  yChar.rotation = new BABYLON.Vector3(Math.PI, 0, 0);

  var zChar = makeTextPlane("Z", "blue", size / 10);
  zChar.position = new BABYLON.Vector3(0, 0.125 * position, 0.95 * position);

  const axes = new BABYLON.AxesViewer(scene, 0.8);
  axes.xAxis.parent = cube;
  axes.yAxis.parent = cube;
  axes.zAxis.parent = cube;

  return scene;
}

function updateViewport(
  w: any,
  h: any,
  bottom: any,
  right: any,
  canvas: HTMLCanvasElement
) {
  return new BABYLON.Viewport(
    1 - (w + right) / canvas.width,
    1 - (bottom + canvas.height) / canvas.height,
    w / canvas.width,
    h / canvas.height
  );
}

export function updateAxisViewViewport(
  axisViewScene: BABYLON.Scene,
  canvas: HTMLCanvasElement
): void {
  if (axisViewScene.activeCamera == null) return;
  axisViewScene.activeCamera.viewport = updateViewport(200, 200, 0, 0, canvas);
}
