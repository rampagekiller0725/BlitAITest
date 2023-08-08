import Api from "./api";
import { Storage } from "aws-amplify";

class GenerateMeshService {
  async generateMesh(
    username: any,
    projectId: any,
    geometry: any,
    meshSimulation: any,
    uploadGeometry: boolean
  ) {
    if (uploadGeometry) {
      await Storage.put(
        `${username}/projects/${projectId}/tmp/geometry.json`,
        geometry,
        {
          contentType: "application/json",
        }
      );
    }

    await Storage.put(
      `${username}/projects/${projectId}/tmp/mesh_simulation.json`,
      meshSimulation,
      {
        contentType: "application/json",
      }
    );

    const responses = await Api.post("/generate_mesh", { projectId });

    return responses;
  }
}

const generateMeshService = new GenerateMeshService();
export default generateMeshService;
