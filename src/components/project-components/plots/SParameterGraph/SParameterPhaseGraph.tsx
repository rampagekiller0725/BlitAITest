import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

interface SParameterPhaseGraphProps {
  phaseData: any[];
}

const SParameterPhaseGraph = (props: SParameterPhaseGraphProps) => {
  const { phaseData } = props;
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (phaseData !== data) {
      setData(phaseData);
    }
  }, [phaseData, data]);

  return (
    <Plot
      data={data}
      layout={{
        width: 0.75 * window.innerWidth,
        height: 0.75 * window.innerHeight,
        autosize: true,
        xaxis: {
          title: "Frequency (MHz)",
        },
        yaxis: {
          title: "Phase",
          ticksuffix: "&deg;",
        },
        title: "S-Parameters (Phase)",
      }}
      // style={{
      //   display: "block",
      //   width: "99%",
      //   height: "100%",
      //   border: "red 1px solid",
      // }}
      // className="block w-full"
      config={{
        responsive: true,
        displaylogo: false,
        doubleClick: "reset",
      }}
      // useResizeHandler={true}
    />
  );
};

export default SParameterPhaseGraph;
