import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

interface VoltageGraphProps {
  voltageData: any[];
}

const VoltageGraph = (props: VoltageGraphProps) => {
  const { voltageData } = props;
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (voltageData !== data) {
      setData(voltageData);
    }
  }, [voltageData, data]);

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
          title: "Voltage (&mu;V)",
        },
        title: "Time-Domain Voltages",
      }}
      config={{
        responsive: true,
        displaylogo: false,
        doubleClick: "reset",
      }}
    />
  );
};

export default VoltageGraph;
