import Api from "./api";
import { Storage } from "aws-amplify";

const step2stl = async (username: any, projectId: any, data: any) => {
  await Storage.put(`${username}/projects/${projectId}/tmp/model.step`, data, {
    contentType: "application/octet-stream",
  });

  const response = await Api.post("/step2stl", { projectId });

  const stl = await Storage.get(
    `${username}/projects/${projectId}/tmp/stl.json`,
    {
      download: true,
      cacheControl: "no-cache",
    }
  );

  await Storage.remove(`${username}/projects/${projectId}/tmp/model.step`);
  await Storage.remove(`${username}/projects/${projectId}/tmp/stl.json`);

  if (stl.Body) {
    const dataBody: any = stl.Body;
    const dataString = await dataBody.text();
    const json = JSON.parse(dataString);
    return json;
  }
};

export default step2stl;
