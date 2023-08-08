import { selectModels } from "state/reducers/modelSlice";
// import { scene } from "../MainScene";
import { useAppSelector } from "state/hooks";
import * as BABYLON from "babylonjs";
import { useEffect, useState } from "react";
import { hideMeshes, showMeshes } from "./TabUtils";
import EditXYMenu from "../babylonjs/ActionsBar/Generate/EditXYMenu";
import EditYZMenu from "../babylonjs/ActionsBar/Generate/EditYZMenu";
import EditXZMenu from "../babylonjs/ActionsBar/Generate/EditXZMenu";
import { selectGeneratedMesh } from "state/reducers/generatedMeshSlice";

export interface MeshTabProps {
  mainScene: BABYLON.Scene | any;
}

const setPerspectiveView = (
  combinedBoundingBox: BABYLON.BoundingBox,
  camera: BABYLON.ArcRotateCamera
) => {
  var width =
    combinedBoundingBox.maximumWorld.x - combinedBoundingBox.minimumWorld.x;
  var height =
    combinedBoundingBox.maximumWorld.y - combinedBoundingBox.minimumWorld.y;
  var depth =
    combinedBoundingBox.maximumWorld.z - combinedBoundingBox.minimumWorld.z;

  // Calculate the maximum dimension of the bounding box
  var maxDimension = Math.max(width, height, depth);

  // Calculate the desired orthographic scale based on the maximum dimension
  var scale = height / width;

  // Adjust the camera's position and target
  camera.position = new BABYLON.Vector3(
    maxDimension,
    maxDimension,
    maxDimension
  );
  camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
  camera.alpha = Math.PI / 3.5;
  camera.beta = Math.PI / 2.7;
  camera.radius = maxDimension * 2;
};

const setOrthographicView = (
  combinedBoundingBox: BABYLON.BoundingBox,
  camera: BABYLON.ArcRotateCamera
) => {
  var width =
    combinedBoundingBox.maximumWorld.x - combinedBoundingBox.minimumWorld.x;
  var height =
    combinedBoundingBox.maximumWorld.y - combinedBoundingBox.minimumWorld.y;
  var depth =
    combinedBoundingBox.maximumWorld.z - combinedBoundingBox.minimumWorld.z;

  // Calculate the maximum dimension of the bounding box
  var maxDimension = Math.max(width, height, depth);

  // Calculate the desired orthographic scale based on the maximum dimension
  var scale = height / width;

  // Adjust the camera's position and target
  camera.position = new BABYLON.Vector3(0, 0, maxDimension * 100);
  camera.mode = BABYLON.Camera.ORTHOGRAPHIC_CAMERA;
  camera.setTarget(BABYLON.Vector3.Zero());
};

const showFrontView = (camera: BABYLON.ArcRotateCamera) => {
  // Front view
  camera.alpha = Math.PI / 2;
  camera.beta = Math.PI / 2;
};

const showBackView = (camera: BABYLON.ArcRotateCamera) => {
  // back view
  camera.alpha = -Math.PI / 2;
  camera.beta = Math.PI / 2;
};

const showRightView = (camera: BABYLON.ArcRotateCamera) => {
  camera.alpha = 0;
  camera.beta = Math.PI / 2;
};

const showLeftView = (camera: BABYLON.ArcRotateCamera) => {
  camera.alpha = -Math.PI;
  camera.beta = Math.PI / 2;
};

const showTopView = (camera: BABYLON.ArcRotateCamera) => {
  camera.alpha = 0;
  camera.beta = 0.0000001;
};

const showBottomView = (camera: BABYLON.ArcRotateCamera) => {
  camera.alpha = 0;
  camera.beta = Math.PI;

  // to prevent auto tilting to elevation
  camera.useFramingBehavior = false;
};
const resetView = (
  camera: BABYLON.ArcRotateCamera,
  combinedBoundingBox: BABYLON.BoundingBox
) => {
  document.addEventListener("keydown", (event) => {
    if (event.shiftKey) {
      camera._panningMouseButton = 0;
    }
  });
  document.addEventListener("keyup", (event) => {
    if (!event.shiftKey) {
      camera._panningMouseButton = 2;
    }
  });

  camera.mode = BABYLON.Camera.PERSPECTIVE_CAMERA;
  camera.setTarget(BABYLON.Vector3.Zero());
  //camera.setPosition(new BABYLON.Vector3(0, 0, 5));
  camera.alpha = Math.PI / 3.5;
  camera.beta = Math.PI / 2.7;
  setPerspectiveView(combinedBoundingBox, camera);
  return;
};
const handleChangeView = (
  e: any,
  viewType: string,
  meshes: any,
  mainScene: BABYLON.Scene,
  generatedMesh: any
) => {
  const camera = mainScene.activeCamera as BABYLON.ArcRotateCamera;

  // Exclude ports and lumped elements from included meshes
  meshes = meshes.filter((mesh: any) => {
    return mesh._lineMaterial === undefined;
  });
  if (meshes.length === 0) return;

  const getCombinedBoundingBox = (meshes: BABYLON.Mesh[]) => {
    if (meshes.length === 0) {
      return new BABYLON.BoundingBox(
        new BABYLON.Vector3(0, 0, 0),
        new BABYLON.Vector3(0, 0, 0)
      );
    }

    const firstBox = meshes[0].getBoundingInfo().boundingBox;

    let combinedBoundingBox = new BABYLON.BoundingBox(
      firstBox.minimumWorld.clone(),
      firstBox.maximumWorld.clone()
    );

    // Iterate through each bounding box
    for (let i = 1; i < meshes.length; i++) {
      const currentBoundingBox = meshes[i].getBoundingInfo().boundingBox;

      // Calculate the minimum and maximum coordinates for the current bounding box
      const min = currentBoundingBox.minimumWorld;
      const max = currentBoundingBox.maximumWorld;

      // Update the merged bounding box's minimum and maximum coordinates
      combinedBoundingBox.minimumWorld.minimizeInPlace(min);
      combinedBoundingBox.maximumWorld.maximizeInPlace(max);
    }
    return combinedBoundingBox;
  };

  let combinedBoundingBox = getCombinedBoundingBox(meshes);

  // Disable rotation and enable panning when in a side view
  if (
    viewType === "front" ||
    viewType === "back" ||
    viewType === "left" ||
    viewType === "right" ||
    viewType === "top" ||
    viewType === "bottom"
  ) {
    camera._panningMouseButton = 0;
    camera.angularSensibilityX = Number.MAX_VALUE;
    camera.angularSensibilityY = Number.MAX_VALUE;
    camera.panningSensibility = 5;
  } else {
    camera._panningMouseButton = 2;
    camera.angularSensibilityX = 250;
    camera.angularSensibilityY = 250;
    camera.panningSensibility = 10;
  }

  if (viewType === "reset") {
    return resetView(camera, combinedBoundingBox);
  }

  // Calculate the combined bounding box of all meshes
  var width =
    combinedBoundingBox.maximumWorld.x - combinedBoundingBox.minimumWorld.x;
  var height =
    combinedBoundingBox.maximumWorld.y - combinedBoundingBox.minimumWorld.y;
  var depth =
    combinedBoundingBox.maximumWorld.z - combinedBoundingBox.minimumWorld.z;

  let zoom = Math.max(width, height, depth) * 2;

  const canvas = mainScene.getEngine().getRenderingCanvas();
  var canvas_width = canvas?.width;
  var canvas_height = canvas?.height;
  if (canvas_width !== undefined && canvas_height !== undefined) {
    const aspectRatio = canvas_width / canvas_height;

    camera.orthoLeft = -zoom * aspectRatio;
    camera.orthoRight = zoom * aspectRatio;
    camera.orthoTop = zoom;
    camera.orthoBottom = -zoom;
  }

  if (canvas !== null) {
    canvas.addEventListener("wheel", (event) => {
      let newZoom;
      if (event.deltaY < 0) {
        newZoom = zoom / 1.1;
      } else {
        newZoom = zoom * 1.1;
      }

      // Calculate the min and max zoom levels
      var minDimension = 0.01;
      if (generatedMesh === undefined) {
        console.log("Undefined!");
        width =
          combinedBoundingBox.maximumWorld.x -
          combinedBoundingBox.minimumWorld.x;
        height =
          combinedBoundingBox.maximumWorld.y -
          combinedBoundingBox.minimumWorld.y;
        depth =
          combinedBoundingBox.maximumWorld.z -
          combinedBoundingBox.minimumWorld.z;
        minDimension = Math.min(width, height, depth);
      } else {
        let minDiff: number = Number.MAX_VALUE;

        for (let i = 1; i < generatedMesh.x.length; i++) {
          let diff: number = generatedMesh.x[i] - generatedMesh.x[i - 1];
          if (diff < minDiff) {
            minDimension = diff;
          }
        }
        for (let i = 1; i < generatedMesh.y.length; i++) {
          let diff: number = generatedMesh.y[i] - generatedMesh.y[i - 1];
          if (diff < minDiff && diff < minDimension) {
            minDimension = diff;
          }
        }
        for (let i = 1; i < generatedMesh.z.length; i++) {
          let diff: number = generatedMesh.z[i] - generatedMesh.z[i - 1];
          if (diff < minDiff && diff < minDimension) {
            minDimension = diff;
          }
        }

        width =
          Math.max.apply(null, generatedMesh.x) -
          Math.min.apply(null, generatedMesh.x);
        height =
          Math.max.apply(null, generatedMesh.y) -
          Math.min.apply(null, generatedMesh.y);
        depth =
          Math.max.apply(null, generatedMesh.z) -
          Math.min.apply(null, generatedMesh.z);
      }

      var maxDimension = Math.max(width, height, depth);

      const minZoom = minDimension * 2;
      const maxZoom = maxDimension;

      if (newZoom < minZoom) newZoom = minZoom;
      if (newZoom > maxZoom) newZoom = maxZoom;

      zoom = newZoom;

      const canvas = mainScene.getEngine().getRenderingCanvas();
      var canvas_width = canvas?.width;
      var canvas_height = canvas?.height;
      if (canvas_width !== undefined && canvas_height !== undefined) {
        const aspectRatio = canvas_width / canvas_height;

        camera.orthoLeft = -zoom * aspectRatio;
        camera.orthoRight = zoom * aspectRatio;
        camera.orthoTop = zoom;
        camera.orthoBottom = -zoom;
      }
    });
  }

  // Calculate the dimensions of the combined bounding box
  setOrthographicView(combinedBoundingBox, camera);

  switch (viewType) {
    case "front":
      showFrontView(camera);
      break;
    case "back":
      showBackView(camera);
      break;
    case "left":
      showLeftView(camera);
      break;
    case "right":
      showRightView(camera);
      break;
    case "top":
      showTopView(camera);
      break;
    case "bottom":
      showBottomView(camera);
      break;
  }
};

const MeshTab = ({ mainScene }: MeshTabProps) => {
  const [meshes, setMeshes] = useState<BABYLON.Mesh[]>([]);
  const models = useAppSelector(selectModels);
  const [isEditXYMenuVisible, setEditXYMenuVisible] = useState(false);
  const [isEditYZMenuVisible, setEditYZMenuVisible] = useState(false);
  const [isEditXZMenuVisible, setEditXZMenuVisible] = useState(false);
  const [meshDefined, setMeshDefined] = useState(false);
  const generatedMesh = useAppSelector(selectGeneratedMesh);
  const modelsToDraw = Object.values(models);
  const arrayModel = modelsToDraw.flat() as any[];

  const getMeshes = () => {
    const modelsToDraw = Object.values(models);
    const arrayModel = modelsToDraw.flat();
    let meshes: BABYLON.Mesh[] = [];
    arrayModel.forEach((model: any) => {
      const mesh = mainScene.getMeshById(model?.id) as BABYLON.Mesh;
      meshes.push(mesh);
    });
    setMeshes(meshes);
    return meshes;
  };

  useEffect(() => {
    const meshExist = generatedMesh !== undefined;
    setMeshDefined(meshExist);
  }, [arrayModel]);

  useEffect(() => {
    getMeshes();
    showMeshes("_meshLines", mainScene);
    hideMeshes("_meshLinesSecondary", mainScene);
    hideMeshes("ground", mainScene);
  }, [mainScene, models]);
  useEffect(() => {
    return () => {
      let meshes: BABYLON.Mesh[] = getMeshes();
      // Perform cleanup operations here
      handleChangeView(null, "reset", meshes, mainScene, generatedMesh);
    };
  }, []);

  const openEditXYMenu = (e: any) => {
    setEditXYMenuVisible(true);
  };

  const openEditYZMenu = (e: any) => {
    setEditYZMenuVisible(true);
  };

  const openEditXZMenu = (e: any) => {
    setEditXZMenuVisible(true);
  };

  return (
    <div className="font-inter grid grid-flow-col justify-center gap-3 pb-0 ">
      {/* Edit XYZ */}
      <div className="text-center border-r border-[#EAECF0] pr-3 ">
        <div className="flex">
          {/* Edit YZ */}
          <button
            onClick={openEditYZMenu}
            className={`text-[#344054] my-auto shadow-sm px-3 py-1.5 font-medium border border-[#D0D5DD] text-sm flex items-center justify-center rounded-bl-md rounded-tl-md focus:outline-none ${
              meshDefined
                ? "bg-green-50 hover:bg-[#D9E8DD] active:bg-[#C5D6C8]"
                : "bg-[#D9D9D9]"
            }`}
            disabled={!meshDefined}
          >
            <svg
              className="mr-2 w-5 h-5"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.8663 3.42747H6.38671C4.99474 3.42747 4.29876 3.42747 3.7671 3.69837C3.29944 3.93666 2.91922 4.31688 2.68093 4.78454C2.41003 5.3162 2.41003 6.01218 2.41003 7.40415V14.3633C2.41003 15.7553 2.41003 16.4513 2.68093 16.9829C2.91922 17.4506 3.29944 17.8308 3.7671 18.0691C4.29876 18.34 4.99474 18.34 6.38671 18.34H13.3459C14.7379 18.34 15.4338 18.34 15.9655 18.0691C16.4332 17.8308 16.8134 17.4506 17.0517 16.9829C17.3226 16.4513 17.3226 15.7553 17.3226 14.3633V10.8837M7.38086 13.3692H8.76818C9.17345 13.3692 9.37609 13.3692 9.56678 13.3234C9.73585 13.2828 9.89748 13.2158 10.0457 13.125C10.2129 13.0225 10.3562 12.8792 10.6428 12.5927L18.5653 4.67019C19.2516 3.98386 19.2516 2.87109 18.5653 2.18476C17.879 1.49843 16.7662 1.49843 16.0799 2.18476L8.15736 10.1072C7.87078 10.3938 7.7275 10.5371 7.62503 10.7043C7.53418 10.8526 7.46723 11.0142 7.42664 11.1833C7.38086 11.374 7.38086 11.5766 7.38086 11.9819V13.3692Z"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Edit YZ
          </button>

          {/* Edit XZ */}
          <button
            onClick={openEditXZMenu}
            className={`text-[#344054] my-auto shadow-sm px-3 py-1.5 font-medium border border-[#D0D5DD] text-sm flex items-center justify-center focus:outline-none border-l-0 border-r-0" ${
              meshDefined
                ? "bg-green-50 hover:bg-[#D9E8DD] active:bg-[#C5D6C8]"
                : "bg-[#D9D9D9]"
            }`}
            disabled={!meshDefined}
          >
            <svg
              className="mr-2 w-5 h-5"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.8663 3.42747H6.38671C4.99474 3.42747 4.29876 3.42747 3.7671 3.69837C3.29944 3.93666 2.91922 4.31688 2.68093 4.78454C2.41003 5.3162 2.41003 6.01218 2.41003 7.40415V14.3633C2.41003 15.7553 2.41003 16.4513 2.68093 16.9829C2.91922 17.4506 3.29944 17.8308 3.7671 18.0691C4.29876 18.34 4.99474 18.34 6.38671 18.34H13.3459C14.7379 18.34 15.4338 18.34 15.9655 18.0691C16.4332 17.8308 16.8134 17.4506 17.0517 16.9829C17.3226 16.4513 17.3226 15.7553 17.3226 14.3633V10.8837M7.38086 13.3692H8.76818C9.17345 13.3692 9.37609 13.3692 9.56678 13.3234C9.73585 13.2828 9.89748 13.2158 10.0457 13.125C10.2129 13.0225 10.3562 12.8792 10.6428 12.5927L18.5653 4.67019C19.2516 3.98386 19.2516 2.87109 18.5653 2.18476C17.879 1.49843 16.7662 1.49843 16.0799 2.18476L8.15736 10.1072C7.87078 10.3938 7.7275 10.5371 7.62503 10.7043C7.53418 10.8526 7.46723 11.0142 7.42664 11.1833C7.38086 11.374 7.38086 11.5766 7.38086 11.9819V13.3692Z"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Edit XZ
          </button>

          {/* Edit XY */}
          <button
            onClick={openEditXYMenu}
            className={`text-[#344054] my-auto shadow-sm px-3 py-1.5 font-medium border border-[#D0D5DD] text-sm flex items-center justify-center rounded-tr-md rounded-br-md focus:outline-none border-l-0 border-r-0" ${
              meshDefined
                ? "bg-green-50 hover:bg-[#D9E8DD] active:bg-[#C5D6C8]"
                : "bg-[#D9D9D9]"
            }`}
            disabled={!meshDefined}
          >
            <svg
              className="mr-2 w-5 h-5"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.8663 3.42747H6.38671C4.99474 3.42747 4.29876 3.42747 3.7671 3.69837C3.29944 3.93666 2.91922 4.31688 2.68093 4.78454C2.41003 5.3162 2.41003 6.01218 2.41003 7.40415V14.3633C2.41003 15.7553 2.41003 16.4513 2.68093 16.9829C2.91922 17.4506 3.29944 17.8308 3.7671 18.0691C4.29876 18.34 4.99474 18.34 6.38671 18.34H13.3459C14.7379 18.34 15.4338 18.34 15.9655 18.0691C16.4332 17.8308 16.8134 17.4506 17.0517 16.9829C17.3226 16.4513 17.3226 15.7553 17.3226 14.3633V10.8837M7.38086 13.3692H8.76818C9.17345 13.3692 9.37609 13.3692 9.56678 13.3234C9.73585 13.2828 9.89748 13.2158 10.0457 13.125C10.2129 13.0225 10.3562 12.8792 10.6428 12.5927L18.5653 4.67019C19.2516 3.98386 19.2516 2.87109 18.5653 2.18476C17.879 1.49843 16.7662 1.49843 16.0799 2.18476L8.15736 10.1072C7.87078 10.3938 7.7275 10.5371 7.62503 10.7043C7.53418 10.8526 7.46723 11.0142 7.42664 11.1833C7.38086 11.374 7.38086 11.5766 7.38086 11.9819V13.3692Z"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Edit XY
          </button>
        </div>
        <p className="mt-1.5 text-sm font-normal text-[#475467]">
          Manual grid refinement
        </p>
      </div>

      {/* Reset */}
      <div className="text-center">
        <div className="flex">
          <button
            onClick={(e) => {
              handleChangeView(e, "reset", meshes, mainScene, generatedMesh);
              hideMeshes("_meshLinesSecondary", mainScene);
            }}
            className={`text-[#344054] my-auto shadow-sm px-3 py-1.5 font-medium border border-[#D0D5DD] text-sm flex items-center justify-center rounded-md focus:outline-none ${
              arrayModel.some((dict) => Object.values(dict).includes("Objects"))
                ? "bg-[#FEFBE8] hover:bg-[#E3E2C3] active:bg-[#C8C9A8]"
                : "bg-[#D9D9D9]"
            }`}
            disabled={
              !arrayModel.some((dict) =>
                Object.values(dict).includes("Objects")
              )
            }
          >
            <svg
              className="mr-2 w-5 h-5"
              width="22"
              height="16"
              viewBox="0 0 22 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.26 5.15845C20.26 4.59747 20.26 4.31698 20.1491 4.18709C20.0528 4.07439 19.9084 4.01459 19.7607 4.02621C19.5904 4.03962 19.392 4.23795 18.9954 4.63463L15.63 8.00001L18.9954 11.3654C19.392 11.7621 19.5904 11.9604 19.7607 11.9738C19.9084 11.9854 20.0528 11.9256 20.1491 11.8129C20.26 11.683 20.26 11.4025 20.26 10.8416V5.15845Z"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.73999 5.96281C1.73999 4.40698 1.73999 3.62907 2.04277 3.03482C2.30911 2.51211 2.73409 2.08713 3.2568 1.82079C3.85105 1.51801 4.62896 1.51801 6.18479 1.51801H11.1852C12.741 1.51801 13.5189 1.51801 14.1132 1.82079C14.6359 2.08713 15.0609 2.51211 15.3272 3.03482C15.63 3.62907 15.63 4.40698 15.63 5.96281V10.0372C15.63 11.593 15.63 12.3709 15.3272 12.9652C15.0609 13.4879 14.6359 13.9129 14.1132 14.1792C13.5189 14.482 12.741 14.482 11.1852 14.482H6.18479C4.62896 14.482 3.85105 14.482 3.2568 14.1792C2.73409 13.9129 2.30911 13.4879 2.04277 12.9652C1.73999 12.3709 1.73999 11.593 1.73999 10.0372V5.96281Z"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Reset view
          </button>
        </div>
        <p className="mt-1.5 text-sm font-normal text-[#475467]">
          3D projection
        </p>
      </div>
      {/* className="mr-2 w-5 h-5" */}

      {/* ------- XY Plane -------- */}
      <div className="text-center">
        <div className="flex">
          {/* Front */}
          <button
            onClick={(e) => {
              handleChangeView(e, "front", meshes, mainScene, generatedMesh);
              showMeshes("_meshLinesSecondary", mainScene);
            }}
            className={`text-[#344054] my-auto shadow-sm px-3 py-1.5 font-medium border border-[#D0D5DD] text-sm flex items-center justify-center rounded-bl-md rounded-tl-md focus:outline-none ${
              arrayModel.some((dict) => Object.values(dict).includes("Objects"))
                ? "bg-[#EEF4FF] hover:bg-[#D3E2EF] active:bg-[#B1C7DE]"
                : "bg-[#D9D9D9]"
            }`}
            disabled={
              !arrayModel.some((dict) =>
                Object.values(dict).includes("Objects")
              )
            }
          >
            <svg
              className="mr-2 w-5 h-5"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.9989 10.2C1.9989 9.0799 1.9989 8.51984 2.21689 8.09202C2.40864 7.71569 2.7146 7.40973 3.09092 7.21799C3.51874 7 4.0788 7 5.1989 7H10.7989C11.919 7 12.4791 7 12.9069 7.21799C13.2832 7.40973 13.5892 7.71569 13.7809 8.09202C13.9989 8.51984 13.9989 9.0799 13.9989 10.2V15.8C13.9989 16.9201 13.9989 17.4802 13.7809 17.908C13.5892 18.2843 13.2832 18.5903 12.9069 18.782C12.4791 19 11.919 19 10.7989 19H5.1989C4.0788 19 3.51874 19 3.09092 18.782C2.7146 18.5903 2.40864 18.2843 2.21689 17.908C1.9989 17.4802 1.9989 16.9201 1.9989 15.8V10.2Z"
                fill="#FFD6AE"
              />
              <path
                d="M18.2058 14.0394H14.0383M6.62946 2.46306V6.63056M2.46196 6.63056H14.0383M14.0383 6.63056V18.2069M14.0383 6.63056L18.2058 2.46306M18.6689 13.4257V2.74089C18.6689 2.48155 18.6689 2.35189 18.6184 2.25283C18.574 2.1657 18.5032 2.09486 18.4161 2.05047C18.317 2 18.1873 2 17.928 2H7.24323C7.01671 2 6.90345 2 6.79687 2.02559C6.70237 2.04828 6.61203 2.08569 6.52917 2.13647C6.43571 2.19374 6.35563 2.27383 6.19545 2.434L2.4329 6.19655C2.27273 6.35673 2.19265 6.43681 2.13537 6.53027C2.0846 6.61313 2.04718 6.70347 2.02449 6.79797C1.9989 6.90455 1.9989 7.01781 1.9989 7.24433V17.9291C1.9989 18.1884 1.9989 18.3181 2.04937 18.4172C2.09377 18.5043 2.1646 18.5751 2.25173 18.6195C2.35079 18.67 2.48045 18.67 2.73979 18.67H13.4246C13.6511 18.67 13.7644 18.67 13.8709 18.6444C13.9654 18.6217 14.0558 18.5843 14.1386 18.5335C14.2321 18.4763 14.3122 18.3962 14.4723 18.236L18.2349 14.4734C18.3951 14.3133 18.4752 14.2332 18.5324 14.1397C18.5832 14.0569 18.6206 13.9665 18.6433 13.872C18.6689 13.7654 18.6689 13.6522 18.6689 13.4257Z"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Front
          </button>

          {/* Back */}
          <button
            onClick={(e) => {
              handleChangeView(e, "back", meshes, mainScene, generatedMesh);
              showMeshes("_meshLinesSecondary", mainScene);
            }}
            className={`text-[#344054] my-auto shadow-sm px-3 py-1.5 font-medium border border-[#D0D5DD] text-sm flex items-center justify-center rounded-tr-md rounded-br-md focus:outline-none border-l-0 ${
              arrayModel.some((dict) => Object.values(dict).includes("Objects"))
                ? "bg-[#EEF4FF] hover:bg-[#D3E2EF] active:bg-[#B1C7DE]"
                : "bg-[#D9D9D9]"
            }`}
            disabled={
              !arrayModel.some((dict) =>
                Object.values(dict).includes("Objects")
              )
            }
          >
            <svg
              className="mr-2 w-5 h-5"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.76001 5.2C6.76001 4.0799 6.76001 3.51984 6.978 3.09202C7.16974 2.71569 7.4757 2.40973 7.85203 2.21799C8.27985 2 8.8399 2 9.96001 2H15.56C16.6801 2 17.2402 2 17.668 2.21799C18.0443 2.40973 18.3503 2.71569 18.542 3.09202C18.76 3.51984 18.76 4.0799 18.76 5.2V10.8C18.76 11.9201 18.76 12.4802 18.542 12.908C18.3503 13.2843 18.0443 13.5903 17.668 13.782C17.2402 14 16.6801 14 15.56 14H9.96001C8.8399 14 8.27985 14 7.85203 13.782C7.4757 13.5903 7.16974 13.2843 6.978 12.908C6.76001 12.4802 6.76001 11.9201 6.76001 10.8V5.2Z"
                fill="#FFD6AE"
              />
              <path
                d="M18.2058 14.0394H6.62946M6.62946 14.0394V2.46306M6.62946 14.0394L2.46196 18.2069M2.46196 6.63056H14.0383M14.0383 6.63056V18.2069M14.0383 6.63056L18.2058 2.46306M18.6689 13.4257V2.74089C18.6689 2.48155 18.6689 2.35189 18.6184 2.25283C18.574 2.1657 18.5032 2.09486 18.4161 2.05047C18.317 2 18.1873 2 17.928 2H7.24323C7.01671 2 6.90345 2 6.79687 2.02559C6.70237 2.04828 6.61203 2.08569 6.52917 2.13647C6.43571 2.19374 6.35563 2.27383 6.19545 2.434L2.4329 6.19655C2.27273 6.35673 2.19265 6.43681 2.13537 6.53027C2.0846 6.61313 2.04718 6.70347 2.02449 6.79797C1.9989 6.90455 1.9989 7.01781 1.9989 7.24433V17.9291C1.9989 18.1884 1.9989 18.3181 2.04937 18.4172C2.09377 18.5043 2.1646 18.5751 2.25173 18.6195C2.35079 18.67 2.48045 18.67 2.73979 18.67H13.4246C13.6511 18.67 13.7644 18.67 13.8709 18.6444C13.9654 18.6217 14.0558 18.5843 14.1386 18.5335C14.2321 18.4763 14.3122 18.3962 14.4723 18.236L18.2349 14.4734C18.3951 14.3133 18.4752 14.2332 18.5324 14.1397C18.5832 14.0569 18.6206 13.9665 18.6433 13.872C18.6689 13.7654 18.6689 13.6522 18.6689 13.4257Z"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back
          </button>
        </div>
        <p className="mt-1.5 text-sm font-normal text-[#475467]">XY plane</p>
      </div>

      {/* YZ Plane */}
      <div className="text-center">
        <div className="flex">
          {/* Left */}
          <button
            onClick={(e) => {
              handleChangeView(e, "left", meshes, mainScene, generatedMesh);
              showMeshes("_meshLinesSecondary", mainScene);
            }}
            className={`text-[#344054] my-auto shadow-sm px-3 py-1.5 font-medium border border-[#D0D5DD] text-sm flex items-center justify-center rounded-bl-md rounded-tl-md focus:outline-none ${
              arrayModel.some((dict) => Object.values(dict).includes("Objects"))
                ? "bg-[#FFF1F3] hover:bg-[#EDD0D4] active:bg-[#E0AFB5]"
                : "bg-[#D9D9D9]"
            }`}
            disabled={
              !arrayModel.some((dict) =>
                Object.values(dict).includes("Objects")
              )
            }
          >
            <svg
              className="mr-2 w-5 h-5"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.60257 6.98318C1.5842 7.12345 1.664 7.20324 1.82359 7.36283L2.11505 7.65429C2.10614 7.67838 2.09769 7.70295 2.08972 7.728C1.99889 8.01322 1.99889 8.38658 1.99889 9.13332V12.8667C1.99889 13.6134 1.99889 13.9868 2.08972 14.272C2.16645 14.5129 2.2871 14.7106 2.43545 14.8392C2.09145 15.1835 1.91042 15.3693 1.79607 15.5406C1.68646 15.7049 1.61872 15.8598 1.60257 15.9832C1.5842 16.1235 1.664 16.2032 1.82359 16.3628L2.62146 17.1607C2.78104 17.3203 2.86084 17.4001 3.00111 17.3817C3.1245 17.3656 3.27942 17.2978 3.44367 17.1882C3.63039 17.0636 3.83418 16.8598 4.24174 16.4523L5.69402 15C6.14183 14.9999 6.36928 14.997 6.54388 14.8547C6.70068 14.7268 6.82817 14.5229 6.90806 14.272C6.95947 14.1105 6.98178 13.9208 6.99147 13.6512C6.99974 13.6395 7.00769 13.628 7.01534 13.6166C7.12495 13.4523 7.19269 13.2974 7.20884 13.174C7.22677 13.037 7.15109 12.9577 6.99889 12.8054V9.13332C6.99889 8.38658 6.99889 8.01322 6.90806 7.728C6.82817 7.47712 6.70068 7.27314 6.54388 7.14531C6.36562 6.99999 6.13227 6.99999 5.66556 6.99999H4.69402L6.27938 5.41463C6.68694 5.00706 6.89073 4.80328 7.01534 4.61655C7.12495 4.4523 7.19269 4.29738 7.20884 4.17399C7.2272 4.03372 7.14741 3.95393 6.98782 3.79434L6.18995 2.99647C6.03036 2.83688 5.95057 2.75709 5.8103 2.77545C5.68691 2.7916 5.53199 2.85934 5.36774 2.96895C5.18101 3.09356 4.97723 3.29734 4.56966 3.70491L2.53203 5.74254C2.12446 6.15011 1.92068 6.35389 1.79607 6.54062C1.68646 6.70487 1.61872 6.85979 1.60257 6.98318Z"
                fill="#FFD6AE"
              />
              <path
                d="M18.2058 14.0394H6.62946M6.62946 14.0394V2.46306M6.62946 14.0394L2.46196 18.2069M2.46196 6.63056H14.0383M14.0383 6.63056V18.2069M14.0383 6.63056L18.2058 2.46306M18.6689 13.4257V2.74089C18.6689 2.48155 18.6689 2.35189 18.6184 2.25283C18.574 2.1657 18.5032 2.09486 18.4161 2.05047C18.317 2 18.1873 2 17.928 2H7.24323C7.01671 2 6.90345 2 6.79687 2.02559C6.70237 2.04828 6.61203 2.08569 6.52917 2.13647C6.43571 2.19374 6.35563 2.27383 6.19545 2.434L2.4329 6.19655C2.27273 6.35673 2.19265 6.43681 2.13537 6.53027C2.0846 6.61313 2.04718 6.70347 2.02449 6.79797C1.9989 6.90455 1.9989 7.01781 1.9989 7.24433V17.9291C1.9989 18.1884 1.9989 18.3181 2.04937 18.4172C2.09377 18.5043 2.1646 18.5751 2.25173 18.6195C2.35079 18.67 2.48045 18.67 2.73979 18.67H13.4246C13.6511 18.67 13.7644 18.67 13.8709 18.6444C13.9654 18.6217 14.0558 18.5843 14.1386 18.5335C14.2321 18.4763 14.3122 18.3962 14.4723 18.236L18.2349 14.4734C18.3951 14.3133 18.4752 14.2332 18.5324 14.1397C18.5832 14.0569 18.6206 13.9665 18.6433 13.872C18.6689 13.7654 18.6689 13.6522 18.6689 13.4257Z"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Left
          </button>

          {/* Right */}
          <button
            onClick={(e) => {
              handleChangeView(e, "right", meshes, mainScene, generatedMesh);
              showMeshes("_meshLinesSecondary", mainScene);
            }}
            className={`text-[#344054] my-auto shadow-sm px-3 py-1.5 font-medium border border-[#D0D5DD] text-sm flex items-center justify-center rounded-tr-md rounded-br-md focus:outline-none border-l-0 ${
              arrayModel.some((dict) => Object.values(dict).includes("Objects"))
                ? "bg-[#FFF1F3] hover:bg-[#EDD0D4] active:bg-[#E0AFB5]"
                : "bg-[#D9D9D9]"
            }`}
            disabled={
              !arrayModel.some((dict) =>
                Object.values(dict).includes("Objects")
              )
            }
          >
            <svg
              className="mr-2 w-5 h-5"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.8236 7.36283C13.664 7.20324 13.5842 7.12345 13.6026 6.98318C13.6187 6.85979 13.6865 6.70487 13.7961 6.54062C13.9207 6.35389 14.1245 6.15011 14.532 5.74254L16.5697 3.70491C16.9772 3.29734 17.181 3.09356 17.3677 2.96895C17.532 2.85934 17.6869 2.7916 17.8103 2.77545C17.9506 2.75709 18.0304 2.83688 18.19 2.99647L18.9878 3.79434C19.1474 3.95393 19.2272 4.03372 19.2088 4.17399C19.1927 4.29738 19.125 4.4523 19.0153 4.61655C18.9324 4.7409 18.8143 4.87281 18.6243 5.06742C18.6278 5.06913 18.6314 5.07087 18.6349 5.07266C18.7603 5.13658 18.8623 5.23856 18.9262 5.36401C18.9989 5.50661 18.9989 5.6933 18.9989 6.06667V7.93333C18.9989 8.10788 18.9989 8.24162 18.9915 8.34914C18.9989 8.55581 18.9989 8.80945 18.9989 9.13332V12.8054C19.1511 12.9577 19.2268 13.037 19.2088 13.174C19.1927 13.2974 19.125 13.4523 19.0153 13.6166C19.0077 13.628 18.9997 13.6395 18.9915 13.6512C18.9818 13.9208 18.9595 14.1105 18.9081 14.272C18.8282 14.5229 18.7007 14.7268 18.5439 14.8547C18.3693 14.997 18.1418 14.9999 17.694 15L16.2417 16.4523C15.8342 16.8598 15.6304 17.0636 15.4437 17.1882C15.2794 17.2978 15.1245 17.3656 15.0011 17.3817C14.8608 17.4001 14.781 17.3203 14.6215 17.1607L13.8236 16.3628C13.664 16.2032 13.5842 16.1235 13.6026 15.9832C13.6187 15.8598 13.6865 15.7049 13.7961 15.5406C13.9104 15.3693 14.0914 15.1835 14.4354 14.8392C14.2871 14.7106 14.1665 14.5129 14.0897 14.272C13.9989 13.9868 13.9989 13.6134 13.9989 12.8667V9.13332C13.9989 8.38658 13.9989 8.01322 14.0897 7.728C14.0977 7.70295 14.1061 7.67838 14.115 7.65429L13.8236 7.36283Z"
                fill="#FFD6AE"
              />
              <path
                d="M6.62946 14.0394V2.46306M6.62946 14.0394L2.46196 18.2069M6.62946 14.0394H14.0383M2.46196 6.63056H14.0383M14.0383 6.63056V18.2069M14.0383 6.63056L18.2058 2.46306M18.6689 13.4257V2.74089C18.6689 2.48155 18.6689 2.35189 18.6184 2.25283C18.574 2.1657 18.5032 2.09486 18.4161 2.05047C18.317 2 18.1873 2 17.928 2H7.24323C7.01671 2 6.90345 2 6.79687 2.02559C6.70237 2.04828 6.61203 2.08569 6.52917 2.13647C6.43571 2.19374 6.35563 2.27383 6.19545 2.434L2.4329 6.19655C2.27273 6.35673 2.19265 6.43681 2.13537 6.53027C2.0846 6.61313 2.04718 6.70347 2.02449 6.79797C1.9989 6.90455 1.9989 7.01781 1.9989 7.24433V17.9291C1.9989 18.1884 1.9989 18.3181 2.04937 18.4172C2.09377 18.5043 2.1646 18.5751 2.25173 18.6195C2.35079 18.67 2.48045 18.67 2.73979 18.67H13.4246C13.6511 18.67 13.7644 18.67 13.8709 18.6444C13.9654 18.6217 14.0558 18.5843 14.1386 18.5335C14.2321 18.4763 14.3122 18.3962 14.4723 18.236L18.2349 14.4734C18.3951 14.3133 18.4752 14.2332 18.5324 14.1397C18.5832 14.0569 18.6206 13.9665 18.6433 13.872C18.6689 13.7654 18.6689 13.6522 18.6689 13.4257Z"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Right
          </button>
        </div>
        <p className="mt-1.5 text-sm font-normal text-[#475467]">YZ plane</p>
      </div>

      {/* XZ Plane */}
      <div className="text-center">
        <div className="flex">
          {/* Top */}
          <button
            onClick={(e) => {
              handleChangeView(e, "top", meshes, mainScene, generatedMesh);
              showMeshes("_meshLinesSecondary", mainScene);
            }}
            className={`text-[#344054] my-auto shadow-sm px-3 py-1.5 font-medium border border-[#D0D5DD] text-sm flex items-center justify-center rounded-bl-md rounded-tl-md focus:outline-none" ${
              arrayModel.some((dict) => Object.values(dict).includes("Objects"))
                ? "bg-[#F3FEE7] hover:bg-[#E2EFD4] active:bg-[#BFCDB0]"
                : "bg-[#D9D9D9]"
            }`}
            disabled={
              !arrayModel.some((dict) =>
                Object.values(dict).includes("Objects")
              )
            }
          >
            <svg
              className="mr-2 w-5 h-5"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.8259 1.87259C13.9624 1.80355 14.0306 1.76903 14.1555 1.76467C14.2654 1.76084 14.4048 1.77288 14.5538 1.79906C14.7232 1.82882 14.9101 1.88537 15.284 1.99847L15.284 1.99848L15.284 1.99848L15.4293 2.04242C15.4635 2.0376 15.5083 2.04143 15.56 2.0538C15.6235 2.069 15.7021 2.10311 15.8405 2.16683L17.1533 2.56396L17.1534 2.56396C17.5272 2.67706 17.7142 2.73361 17.8304 2.79025C17.9327 2.84007 17.9975 2.88982 18.0157 2.93238C18.0363 2.98076 17.9681 3.01528 17.8316 3.08432L17.4209 3.29202L17.3958 3.57077C17.3882 3.65433 17.3845 3.69611 17.3437 3.71051C17.3079 3.72317 17.2528 3.7214 17.1861 3.70546C17.1356 3.69336 17.0754 3.66927 16.9831 3.6278L16.984 3.63227C16.9942 3.68862 16.9894 3.742 16.9702 3.78476C16.9485 3.83338 16.8996 3.86162 16.8017 3.91811L16.3125 4.20054C16.2638 4.22869 16.2272 4.24982 16.1962 4.26327C16.1394 4.30051 16.0665 4.3426 15.9716 4.39736L15.9716 4.39737L15.0368 4.9371C15.0295 5.01758 15.0251 5.05809 14.9852 5.07221C14.9494 5.08488 14.8942 5.08311 14.8276 5.06717L14.8157 5.06415C14.6929 5.13303 14.6159 5.1693 14.5415 5.17797C14.5342 5.17883 14.5268 5.1795 14.5195 5.17999C14.6475 5.32209 14.7249 5.41514 14.7784 5.50256C14.8452 5.61165 14.8864 5.71455 14.8962 5.7965C14.9074 5.88967 14.8588 5.94267 14.7616 6.04867L14.2757 6.57862C14.1785 6.68462 14.1299 6.73762 14.0445 6.72542C13.9693 6.71469 13.875 6.6697 13.7749 6.5969C13.6992 6.54178 13.6189 6.46333 13.5003 6.33712L13.4971 6.3442C13.4582 6.42752 13.3961 6.49526 13.3197 6.53771C13.2328 6.58597 13.1191 6.58597 12.8917 6.58597H11.7549C11.5275 6.58597 11.4138 6.58597 11.3269 6.53771C11.2594 6.5002 11.2031 6.44295 11.164 6.37265C11.0218 6.38557 10.8643 6.39935 10.6887 6.41472L10.6886 6.41472L8.79254 6.58061C8.69655 6.68528 8.64803 6.73754 8.56314 6.72542C8.49675 6.71594 8.41538 6.67973 8.32834 6.62122L6.43155 6.78717C5.58005 6.86166 5.1543 6.89891 4.82431 6.87292C4.53404 6.85005 4.29476 6.79397 4.14077 6.71273C3.96571 6.62036 3.95347 6.48047 3.92899 6.20068L3.80661 4.80188C3.78213 4.52209 3.7699 4.3822 3.92626 4.26084C4.0638 4.15409 4.2897 4.05731 4.57159 3.98439C4.87433 3.90607 5.27103 3.8685 6.03186 3.80177C6.05491 3.7659 6.0897 3.72796 6.13508 3.67847L6.24606 3.55744L5.84467 3.43601L5.84466 3.43601L5.84463 3.436C5.47076 3.3229 5.28382 3.26635 5.16758 3.20972C5.06532 3.1599 5.00047 3.11015 4.98232 3.06759C4.96169 3.01921 5.02994 2.98469 5.16643 2.91565L5.16643 2.91565L5.84881 2.57049L5.84882 2.57049C5.98531 2.50146 6.05355 2.46694 6.17845 2.46258C6.28831 2.45875 6.42773 2.47078 6.57671 2.49697C6.73213 2.52428 6.90234 2.57415 7.21822 2.66957C7.32752 2.60694 7.49897 2.54879 7.71013 2.50286C7.96011 2.4485 8.29103 2.41954 8.95289 2.36164L12.2618 2.07214C12.9237 2.01424 13.2546 1.98529 13.5102 1.99542C13.5328 1.99631 13.5549 1.99741 13.5766 1.99871L13.8259 1.87259Z"
                fill="#FFD6AE"
              />
              <path
                d="M18.2058 14.0394H6.62946M6.62946 14.0394L2.46196 18.2069M6.62946 14.0394V6.63056M2.46196 6.63056H14.0383M14.0383 6.63056V18.2069M14.0383 6.63056L18.2058 2.46306M18.6689 13.4257V2.74089C18.6689 2.48155 18.6689 2.35189 18.6184 2.25283C18.574 2.1657 18.5032 2.09486 18.4161 2.05047C18.317 2 18.1873 2 17.928 2H7.24323C7.01671 2 6.90345 2 6.79687 2.02559C6.70237 2.04828 6.61203 2.08569 6.52917 2.13647C6.43571 2.19374 6.35563 2.27383 6.19545 2.434L2.4329 6.19655C2.27273 6.35673 2.19265 6.43681 2.13537 6.53027C2.0846 6.61313 2.04718 6.70347 2.02449 6.79797C1.9989 6.90455 1.9989 7.01781 1.9989 7.24433V17.9291C1.9989 18.1884 1.9989 18.3181 2.04937 18.4172C2.09377 18.5043 2.1646 18.5751 2.25173 18.6195C2.35079 18.67 2.48045 18.67 2.73979 18.67H13.4246C13.6511 18.67 13.7644 18.67 13.8709 18.6444C13.9654 18.6217 14.0558 18.5843 14.1386 18.5335C14.2321 18.4763 14.3122 18.3962 14.4723 18.236L18.2349 14.4734C18.3951 14.3133 18.4752 14.2332 18.5324 14.1397C18.5832 14.0569 18.6206 13.9665 18.6433 13.872C18.6689 13.7654 18.6689 13.6522 18.6689 13.4257Z"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Top
          </button>

          {/* Bottom */}
          <button
            onClick={(e) => {
              handleChangeView(e, "bottom", meshes, mainScene, generatedMesh);
              showMeshes("_meshLinesSecondary", mainScene);
            }}
            className={`text-[#344054] my-auto shadow-sm px-3 py-1.5 font-medium border border-[#D0D5DD] text-sm flex items-center justify-center rounded-tr-md rounded-br-md focus:outline-none border-l-0 ${
              arrayModel.some((dict) => Object.values(dict).includes("Objects"))
                ? "bg-[#F3FEE7] hover:bg-[#E2EFD4] active:bg-[#BFCDB0]"
                : "bg-[#D9D9D9]"
            }`}
            disabled={
              !arrayModel.some((dict) =>
                Object.values(dict).includes("Objects")
              )
            }
          >
            <svg
              className="mr-2 w-5 h-5"
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13.8257 13.8726C13.9622 13.8036 14.0304 13.769 14.1553 13.7647C14.2652 13.7609 14.4046 13.7729 14.5536 13.7991C14.7229 13.8288 14.9099 13.8854 15.2838 13.9985L15.4291 14.0424C15.4633 14.0376 15.5082 14.0414 15.56 14.0538C15.6236 14.069 15.7023 14.1032 15.8411 14.1671L17.1531 14.564L17.1531 14.564C17.527 14.6771 17.714 14.7336 17.8302 14.7903C17.9325 14.8401 17.9973 14.8898 18.0154 14.9324C18.0361 14.9808 17.9678 15.0153 17.8313 15.0843L17.4209 15.2919L17.3958 15.5708C17.3882 15.6543 17.3845 15.6961 17.3437 15.7105C17.3079 15.7232 17.2528 15.7214 17.1861 15.7055C17.1356 15.6934 17.0754 15.6693 16.9831 15.6278L16.984 15.6323C16.9942 15.6886 16.9894 15.742 16.9702 15.7848C16.9485 15.8334 16.8996 15.8616 16.8017 15.9181L16.3125 16.2005C16.2638 16.2287 16.2272 16.2498 16.1962 16.2633C16.1394 16.3005 16.0665 16.3426 15.9716 16.3974L15.9716 16.3974L15.0368 16.9371C15.0295 17.0176 15.0251 17.0581 14.9852 17.0722C14.9494 17.0849 14.8942 17.0831 14.8276 17.0672L14.8157 17.0641C14.6929 17.133 14.6159 17.1693 14.5415 17.178C14.5342 17.1788 14.5268 17.1795 14.5195 17.18C14.6475 17.3221 14.7249 17.4151 14.7784 17.5026C14.8452 17.6117 14.8864 17.7146 14.8962 17.7965C14.9074 17.8897 14.8588 17.9427 14.7616 18.0487L14.2757 18.5786C14.1785 18.6846 14.1299 18.7376 14.0445 18.7254C13.9693 18.7147 13.875 18.6697 13.7749 18.5969C13.6992 18.5418 13.6189 18.4633 13.5003 18.3371L13.4971 18.3442C13.4582 18.4275 13.3961 18.4953 13.3197 18.5377C13.2328 18.586 13.1191 18.586 12.8917 18.586H11.7549C11.5275 18.586 11.4138 18.586 11.3269 18.5377C11.2594 18.5002 11.2031 18.4429 11.164 18.3727C11.0218 18.3856 10.8643 18.3994 10.6887 18.4147L10.6886 18.4147L8.79254 18.5806C8.69655 18.6853 8.64803 18.7375 8.56314 18.7254C8.49675 18.7159 8.41538 18.6797 8.32834 18.6212L6.43155 18.7872C5.58005 18.8617 5.1543 18.8989 4.82431 18.8729C4.53404 18.85 4.29476 18.794 4.14077 18.7127C3.96571 18.6204 3.95347 18.4805 3.92899 18.2007L3.80661 16.8019C3.78213 16.5221 3.7699 16.3822 3.92626 16.2608C4.0638 16.1541 4.2897 16.0573 4.57159 15.9844C4.87433 15.9061 5.27103 15.8685 6.03186 15.8018C6.05491 15.7659 6.0897 15.728 6.13508 15.6785L6.246 15.5575L5.84444 15.436L5.84443 15.436L5.8444 15.436C5.47053 15.3229 5.28359 15.2664 5.16735 15.2097C5.06509 15.1599 5.00024 15.1102 4.98209 15.0676C4.96146 15.0192 5.02971 14.9847 5.1662 14.9157L5.1662 14.9157L5.84858 14.5705L5.84859 14.5705C5.98508 14.5015 6.05332 14.467 6.17822 14.4626C6.28808 14.4588 6.4275 14.4708 6.57648 14.497C6.7319 14.5243 6.90211 14.5742 7.21799 14.6696C7.32729 14.607 7.49874 14.5488 7.7099 14.5029C7.95988 14.4485 8.2908 14.4196 8.95266 14.3617L12.2616 14.0722C12.9235 14.0143 13.2544 13.9853 13.51 13.9954C13.5325 13.9963 13.5546 13.9974 13.5763 13.9987L13.8257 13.8726Z"
                fill="#FFD6AE"
              />
              <path
                d="M18.206 14.0394H6.62958M6.62958 14.0394V2.46306M6.62958 14.0394L2.46208 18.2069M2.46208 6.63056H14.0385M14.0385 6.63056V18.2069M14.0385 6.63056L18.206 2.46306M18.669 13.4257V2.74089C18.669 2.48155 18.669 2.35189 18.6186 2.25283C18.5742 2.1657 18.5033 2.09486 18.4162 2.05047C18.3171 2 18.1875 2 17.9281 2H7.24335C7.01683 2 6.90357 2 6.79699 2.02559C6.70249 2.04828 6.61216 2.08569 6.52929 2.13647C6.43583 2.19374 6.35575 2.27383 6.19558 2.434L2.43303 6.19655C2.27285 6.35673 2.19277 6.43681 2.1355 6.53027C2.08472 6.61313 2.0473 6.70347 2.02461 6.79797C1.99902 6.90455 1.99902 7.01781 1.99902 7.24433V17.9291C1.99902 18.1884 1.99902 18.3181 2.04949 18.4172C2.09389 18.5043 2.16473 18.5751 2.25186 18.6195C2.35091 18.67 2.48058 18.67 2.73991 18.67H13.4247C13.6512 18.67 13.7645 18.67 13.8711 18.6444C13.9656 18.6217 14.0559 18.5843 14.1388 18.5335C14.2322 18.4763 14.3123 18.3962 14.4725 18.236L18.235 14.4734C18.3952 14.3133 18.4753 14.2332 18.5326 14.1397C18.5833 14.0569 18.6207 13.9665 18.6434 13.872C18.669 13.7654 18.669 13.6522 18.669 13.4257Z"
                stroke="#667085"
                strokeWidth="1.67"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Bottom
          </button>
        </div>
        <p className="mt-1.5 text-sm font-normal text-[#475467]">XZ plane</p>
      </div>
      <EditXYMenu
        visible={isEditXYMenuVisible}
        setVisible={setEditXYMenuVisible}
      />
      <EditYZMenu
        visible={isEditYZMenuVisible}
        setVisible={setEditYZMenuVisible}
      />
      <EditXZMenu
        visible={isEditXZMenuVisible}
        setVisible={setEditXZMenuVisible}
      />
    </div>
  );
};

export default MeshTab;
