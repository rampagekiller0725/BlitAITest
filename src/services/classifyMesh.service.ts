import Api from "./api";

class ClassifyMeshService {
  async classifyMesh(data: any) {
    const response = await Api.post("/classify_mesh", data);
    return response;
  }
}

const classifyMeshService = new ClassifyMeshService();
export default classifyMeshService;
