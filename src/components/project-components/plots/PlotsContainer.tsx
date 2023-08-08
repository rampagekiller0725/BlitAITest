import React, { useRef, useState } from "react";

import { useAppSelector, useAppDispatch } from "state/hooks";
import {
  selectGraph,
  setVSWREnabled,
  setImpedanceEnabled,
  setPattern3DEnabled,
  setEFieldEnabled,
  setHFieldEnabled,
} from "state/reducers/selectedGraphSlice";
import { Storage } from "aws-amplify";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { selectUsername } from "state/reducers/authSlice";
import MyIcon from "assets/MyIcons";
import SParameterGraph from "./SParameterGraph";
import VSWRGraph from "./VSWRGraph";
import ImpedanceGraph from "./ImpedenceGraph";
import TimeSignalsGraph from "./TimeSignalsGraph";
import EFieldGraph from "./EFieldGraph";
import HFieldGraph from "./HFieldGraph";
import Pattern3DGraph from "./Pattern3DGraph";

const getResults = async (
  projectId: string,
  version: string,
  username: any
) => {
  try {
    const data = await Storage.get(
      `${username}/projects/${projectId}/${version}/results/results.json`,
      {
        download: true,
        cacheControl: "no-cache",
      }
    );
    if (data.Body) {
      const dataBody: any = data.Body;
      const dataString = await dataBody.text();
      const json = JSON.parse(dataString);
      return json;
    }
  } catch (err: any) {
    if (err.code === "NoSuchKey") {
      return {};
    } else {
      throw err;
    }
  }
};

const getImpedance = async (projectId: string, username: any, port: string) => {
  try {
    const data = await Storage.get(
      `${username}/projects/${projectId}/case.json`,
      {
        download: true,
        cacheControl: "no-cache",
      }
    );
    if (data.Body) {
      const dataBody: any = data.Body;
      const dataString = await dataBody.text();
      const impedance =
        JSON.parse(dataString)["simulation"]["ports"][port]["impedance"];
      return impedance;
    }
  } catch (err: any) {
    throw err;
  }
};

interface PlotsContainerProps {
  projectId: string;
  version: string;
}

const PlotsContainer = (props: PlotsContainerProps) => {
  const { selectedGraph } = useAppSelector(selectGraph);
  const results = useRef<any>(undefined);
  const { projectId, version } = props;
  const currentUser = useAppSelector(selectUsername);
  const queryClient = useQueryClient();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const toggleAutoRefresh = () => setAutoRefresh(!autoRefresh);

  const [sParameterMagnitudeGraphData, setSParameterMagnitudeGraphData] =
    useState<any>([]);
  const [sParameterPhaseGraphData, setSParameterPhaseGraphData] = useState<any>(
    []
  );
  const [smithGraphData, setSmithGraphData] = useState<any>([]);

  const [vswrGraphData, setvswrGraphData] = useState<any>([]);

  const [impedanceGraphData, setImpedanceGraphData] = useState<any>([]);
  const [voltageGraphData, setVoltageGraphData] = useState<any>([]);
  const [currentGraphData, setCurrentGraphData] = useState<any>([]);

  const [impedanceValues, setImpedanceValues] = useState<any>({});

  const [numFields, setNumFields] = useState(0);

  const dispatch = useAppDispatch();

  const setResults = (data: any) => {
    if (data !== results.current) {
      results.current = data;

      if ("S-Parameters" in results.current) {
        const sparameterKeys = Object.keys(
          results.current["S-Parameters"]
        ).filter((key) => key.startsWith("S"));

        setSParameterMagnitudeGraphData(
          sparameterKeys.map((key) => ({
            x: results.current["S-Parameters"]["Frequency (MHz)"],
            y: results.current["S-Parameters"][key]["Magnitude (dB)"],
            type: "scatter",
            name: key,
          }))
        );
        setSParameterPhaseGraphData(
          sparameterKeys.map((key) => ({
            x: results.current["S-Parameters"]["Frequency (MHz)"],
            y: results.current["S-Parameters"][key]["Phase (deg)"],
            type: "scatter",
            name: key,
          }))
        );
      } else {
        setSParameterMagnitudeGraphData([]);
        setSParameterPhaseGraphData([]);
      }

      if ("VSWR" in results.current) {
        const vswrKeys = Object.keys(results.current["VSWR"]).filter(
          (key) => !key.startsWith("Frequency")
        );

        setNumFields(vswrKeys.length);

        setvswrGraphData(
          vswrKeys.map((key) => ({
            x: results.current["VSWR"]["Frequency (MHz)"],
            y: results.current["VSWR"][key],
            type: "scatter",
            name: "Port " + key,
          }))
        );
        dispatch(setVSWREnabled(true));
      } else {
        setNumFields(1);
        setvswrGraphData([]);
        dispatch(setVSWREnabled(false));
      }

      if ("Impedance" in results.current) {
        const impedanceKeys = Object.keys(results.current["Impedance"]).filter(
          (key) => key.startsWith("Z")
        );

        const data_re = impedanceKeys.map((key) => ({
          x: results.current["Impedance"]["Frequency (MHz)"],
          y: results.current["Impedance"][key]["Resistance (Ohm)"],
          type: "scatter",
          name: key + " (Re)",
        }));

        const data_im = impedanceKeys.map((key) => ({
          x: results.current["Impedance"]["Frequency (MHz)"],
          y: results.current["Impedance"][key]["Reactance (Ohm)"],
          type: "scatter",
          name: key + " (Im)",
        }));

        setImpedanceGraphData(data_re.concat(data_im));
        dispatch(setImpedanceEnabled(true));
      } else {
        setImpedanceGraphData([]);
        dispatch(setImpedanceEnabled(false));
      }

      if ("Time signals" in results.current) {
        const voltageKeys = Object.keys(
          results.current["Time signals"]["Voltage (uV)"]
        );
        setVoltageGraphData(
          voltageKeys.map((key) => ({
            x: results.current["Time signals"]["Time (ns)"] || [],
            y: results.current["Time signals"]["Voltage (uV)"][key] || [],
            type: "scatter",
            name: key,
          }))
        );
        setCurrentGraphData(
          voltageKeys.map((key) => ({
            x: results.current["Time signals"]["Time (ns)"] || [],
            y: results.current["Time signals"]["Current (uA)"][key] || [],
            type: "scatter",
            name: key,
          }))
        );
      } else {
        setVoltageGraphData([]);
        setCurrentGraphData([]);
      }
    }
  };

  const Pattern3DExists = async (
    projectId: string,
    version: string,
    username: any
  ) => {
    let btnPattern3D = false;
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
          "Processing E-Field",
          "Processing H-Field",
          "Processing current",
          "Completed",
          "Terminated",
        ];

        if (validStatus.some((status) => json.status.includes(status))) {
          btnPattern3D = true;
        }
      }
    } catch (err: any) {
      console.log(err);
    }

    try {
      const result: { [key: string]: any } = await Storage.list(
        `${username}/projects/${projectId}/${version}/results/farfield/`
      );
      dispatch(setPattern3DEnabled(btnPattern3D && result.results.length > 0));
    } catch (err) {
      console.log(err);
    }
  };

  const EFieldExists = async (
    projectId: string,
    version: string,
    username: any
  ) => {
    let btnEField = false;
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

        if (validStatus.some((status) => json.status.includes(status))) {
          btnEField = true;
        }
      }
    } catch (err: any) {
      console.log(err);
    }

    try {
      const result: { [key: string]: any } = await Storage.list(
        `${username}/projects/${projectId}/${version}/results/e_field/`
      );
      dispatch(setEFieldEnabled(btnEField && result.results.length > 0));
    } catch (err) {
      console.log(err);
    }
  };

  const HFieldExists = async (
    projectId: string,
    version: string,
    username: any
  ) => {
    let btnHField = false;
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

        const validStatus = ["Processing current", "Completed", "Terminated"];

        if (validStatus.some((status) => json.status.includes(status))) {
          btnHField = true;
        }
      }
    } catch (err: any) {
      console.log(err);
    }

    try {
      const result: { [key: string]: any } = await Storage.list(
        `${username}/projects/${projectId}/${version}/results/h_field/`
      );
      dispatch(setHFieldEnabled(btnHField && result.results.length > 0));
    } catch (err) {
      console.log(err);
    }
  };

  useQuery({
    queryKey: ["plotData", projectId, version, currentUser],
    queryFn: async () => {
      let data: any = {};
      let impedance: any = {};

      if (
        projectId &&
        projectId !== null &&
        projectId !== "" &&
        version &&
        version !== null &&
        version !== ""
      ) {
        data = await getResults(projectId, version, currentUser);

        if ("S-Parameters" in data) {
          const sParameterKeys = Object.keys(data["S-Parameters"]).filter(
            (key) => key.startsWith("S")
          );

          await Pattern3DExists(projectId, version, currentUser);
          await EFieldExists(projectId, version, currentUser);
          await HFieldExists(projectId, version, currentUser);

          impedance = await Promise.all(
            sParameterKeys.map(async (key) => {
              const port = key.match(/S(\d+),/)![1];
              const value = await getImpedance(projectId, currentUser, port);
              return { port, value };
            })
          ).then((result) => {
            return result.reduce((acc: Record<string, number>, curr) => {
              acc[curr.port] = curr.value;
              return acc;
            }, {} as Record<string, number>);
          });
        }
      } else {
        data = {};
        impedance = {};
      }

      return { data, impedance };
    },
    onSuccess: ({ data, impedance }) => {
      setImpedanceValues(impedance);
      setResults(data);

      if ("S-Parameters" in data) {
        const sParameterKeys = Object.keys(data["S-Parameters"]).filter((key) =>
          key.startsWith("S")
        );

        const sParameterKeysSmith = sParameterKeys.filter((key) => {
          let parts = key.split(",");
          let o = parts[0].substring(1);
          let i = parts[1].split("+")[0];
          return o === i || parts[1].includes("+");
        });

        const getSmithGraphData = () => {
          return sParameterKeysSmith.map((key) => {
            const impedanceValue = impedance[key.match(/S(\d+),/)![1]];

            const sParameterMagnitudeLinear = data["S-Parameters"][key][
              "Magnitude (dB)"
            ].map((val: number) => Math.pow(10, val / 20));
            const sParameterPhaseRad = data["S-Parameters"][key][
              "Phase (deg)"
            ].map((val: number) => val * (Math.PI / 180));

            const sParameterReal = sParameterMagnitudeLinear.map(
              (val: number, index: number) =>
                val * Math.cos(sParameterPhaseRad[index])
            );
            const sParameterImag = sParameterMagnitudeLinear.map(
              (val: number, index: number) =>
                val * Math.sin(sParameterPhaseRad[index])
            );

            const zReal = sParameterReal.map(
              (val: number, index: number) =>
                (1 - Math.pow(val, 2) - Math.pow(sParameterImag[index], 2)) /
                (Math.pow(1 - val, 2) + Math.pow(sParameterImag[index], 2))
            );
            const zImag = sParameterImag.map(
              (val: number, index: number) =>
                (2 * val) /
                (Math.pow(1 - sParameterReal[index], 2) + Math.pow(val, 2))
            );

            return {
              real: zReal,
              imag: zImag,
              type: "scattersmith",
              name: key + " (" + impedanceValue + " Ω)",
              hovertemplate:
                "<b>Frequency: %{text} MHz</b><br>" +
                "Re: %{real:.3f} (%{customdata[0]:.3f} Ω)<br>" +
                "Im: %{imag:.3f} (%{customdata[1]:.3f} Ω)",
              text: data["S-Parameters"]["Frequency (MHz)"],
              customdata: zReal.map(function (num: number, idx: number) {
                return [num * impedanceValue, zImag[idx] * impedanceValue];
              }),
            };
          });
        };
        setSmithGraphData(getSmithGraphData());
      } else {
        setSmithGraphData([{ type: "scattersmith" }]);
      }
    },
    onError: (err) => {
      console.log(err);
    },
    refetchOnWindowFocus: false,
    refetchInterval: autoRefresh ? 1000 : false,
  });

  return (
    <>
      {selectedGraph !== "e-field" &&
        selectedGraph !== "h-field" &&
        selectedGraph !== "3d-pattern" && (
          <div className="flex items-center">
            <label htmlFor="autoupdate" className="mx-2 ml-4">
              Auto-update results
            </label>
            <div
              className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in cursor-pointer"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <input
                type="checkbox"
                name="autoupdate"
                id="autoupdate"
                checked={autoRefresh}
                onChange={toggleAutoRefresh}
                className={`z-10 absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer focus:outline-none ${
                  autoRefresh ? "right-0" : "right-6"
                } transition duration-200 ease-in`}
              />
              <span
                className={`block h-6 w-12 bg-gray-300 rounded-full transition duration-200 ${
                  autoRefresh ? "bg-primary-500" : ""
                }`}
              ></span>
            </div>
          </div>
        )}

      <div className="flex flex-col items-center w-full h-full">
        <SParameterGraph
          magnitudeData={sParameterMagnitudeGraphData}
          phaseData={sParameterPhaseGraphData}
          smithData={smithGraphData}
          visible={selectedGraph === "s-parameters"}
        />
        <VSWRGraph data={vswrGraphData} visible={selectedGraph === "vswr"} />
        <ImpedanceGraph
          impedanceData={impedanceGraphData}
          visible={selectedGraph === "impedance"}
        />
        <TimeSignalsGraph
          voltageData={voltageGraphData}
          currentData={currentGraphData}
          visible={selectedGraph === "time-signals"}
        />
        <EFieldGraph
          projectId={projectId}
          version={version}
          visible={selectedGraph === "e-field"}
          numFields={numFields}
        />
        <HFieldGraph
          projectId={projectId}
          version={version}
          visible={selectedGraph === "h-field"}
          numFields={numFields}
        />
        <Pattern3DGraph
          projectId={projectId}
          version={version}
          visible={selectedGraph === "3d-pattern"}
          numFields={numFields}
        />
      </div>
    </>
  );
};

export default PlotsContainer;
