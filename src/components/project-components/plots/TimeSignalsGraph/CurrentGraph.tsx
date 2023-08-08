import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

interface CurrentGraphProps {
  currentData: any[];
}

const CurrentGraph = (props: CurrentGraphProps) => {
  const { currentData } = props;
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (currentData !== data) {
      setData(currentData);
    }
  }, [currentData, data]);

  return (
    <Plot
      data={data}
      layout={{
        width: 0.75 * window.innerWidth,
        height: 0.75 * window.innerHeight,
        autosize: true,
        xaxis: {
          title: "Time (ns)",
        },
        yaxis: {
          title: "Current (&mu;A)",
        },
        title: "Time-Domain Currents",
      }}
      config={{
        responsive: true,
        displaylogo: false,
        doubleClick: "reset",
      }}
    />
  );
};

export default CurrentGraph;
