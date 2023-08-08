import React, { useEffect, useRef, useState } from "react";
import { selectUsername } from "state/reducers/authSlice";
import { useAppSelector } from "state/hooks";
import { Storage } from "aws-amplify";

interface EFieldGraphProps {
  visible: boolean;
  projectId: any;
  version: string;
  numFields: number;
}

const isCompleted = async (
  projectId: string,
  username: any,
  setProgress: any
): Promise<boolean> => {
  try {
    const data = await Storage.get(
      `${username}/projects/${projectId}/info.json`,
      {
        download: true,
        cacheControl: "no-cache",
      }
    );
    if (data.Body) {
      const dataBody: any = data.Body;
      const dataString = await dataBody.text();
      const json = JSON.parse(dataString);

      const validStatus = [
        "Processing H-Field",
        "Processing current",
        "Completed",
        "Terminated",
      ];

      return validStatus.some((status) => json.status.includes(status));
    }
  } catch (err) {
    console.log(err);
  }
  return false;
};

const getEField = async (
  projectId: string,
  version: string,
  username: any,
  setProgress: any
) => {
  try {
    const result: { [key: string]: any } = await Storage.list(
      `${username}/projects/${projectId}/${version}/results/e_field/`
    );
    const list = result.results || [];
    let progressList = new Array(list.length).fill(0);
    const files = await Promise.all(
      list.map(async (item: { key: string }, index: number) => {
        const data = await Storage.get(item.key, {
          download: true,
          cacheControl: "no-cache",
          progressCallback: (progress) => {
            progressList[index] = (progress.loaded / progress.total) * 100;
            setProgress(progressList.reduce((a, b) => a + b, 0) / list.length);
          },
        });
        const dataBody: any = data.Body;
        var blob = new Blob([dataBody], { type: "" });

        const fileName = item.key.split("/").pop();

        if (!fileName) {
          throw new Error("Filename is undefined");
        }

        var file = new File([blob], fileName, { type: "" });
        return file;
      })
    );
    return files;
  } catch (err) {
    console.error(err);
    return [];
  }
};

const EFieldGraph = (props: EFieldGraphProps) => {
  const { visible, projectId, version, numFields } = props;
  const username = useAppSelector(selectUsername);
  const [data, setData] = useState<any[]>([]);
  const [dataFetched, setDataFetched] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [isSimulationComplete, setIsSimulationComplete] =
    useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  useEffect(() => {
    const checkProjectStatus = async () => {
      const completed = await isCompleted(projectId, username, setProgress);
      if (isSimulationComplete && !completed) {
        setDataFetched(false);
      }

      setIsSimulationComplete(completed);
    };

    const poll = setInterval(checkProjectStatus, 1000);

    return () => clearInterval(poll);
  }, [projectId, username, isSimulationComplete]);

  useEffect(() => {
    const fetchData = async () => {
      if (isSimulationComplete && !dataFetched) {
        const fetchedData = await getEField(
          projectId,
          version,
          username,
          setProgress
        );
        if (fetchedData.length < numFields) {
          setDataFetched(false);
        } else {
          setData(fetchedData);
          setDataFetched(true);
        }
      }
    };

    fetchData();
  }, [isSimulationComplete, projectId, version, username, dataFetched]);

  useEffect(() => {
    const sendIframeMessage = () => {
      if (visible && data && iframeRef.current) {
        iframeRef.current.contentWindow?.postMessage(data, "*");
      }
    };

    if (iframeRef.current) {
      iframeRef.current.addEventListener("load", sendIframeMessage);
    }

    if (dataFetched) {
      sendIframeMessage();
    }

    return () => {
      if (iframeRef.current) {
        iframeRef.current.removeEventListener("load", sendIframeMessage);
      }
    };
  }, [visible, data, dataFetched]);

  if (visible && dataFetched) {
    return (
      <iframe
        ref={iframeRef}
        id="vue-app"
        src="/dist_glance"
        style={{ width: "100%", height: "75.3vh", border: "none" }}
      />
    );
  } else if (visible && !dataFetched) {
    return <div>Loading E-Field ({progress.toFixed(0)}%)...</div>;
  }
};

export default EFieldGraph;
