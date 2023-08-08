import { useEffect, useState } from "react";
import Plot from "react-plotly.js";

interface SParameterMagnitudeGraphProps {
  magnitudeData: any[];
}

const SParameterMagnitudeGraph = (props: SParameterMagnitudeGraphProps) => {
  const { magnitudeData } = props;
  const [data, setData] = useState<any>([]);

  useEffect(() => {
    if (magnitudeData !== data) {
      setData(magnitudeData);
    }
  }, [magnitudeData, data]);

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
          title: "Magnitude (dB)",
        },
        title: "S-Parameters (Magnitude)",
      }}
      config={{
        responsive: true,
        displaylogo: false,
        doubleClick: "reset",
      }}
      // style={{
      //   display: "block",
      //   width: "99%",
      //   height: "100%",
      //   border: "red 1px solid",
      // }}
      // className="block w-full"
      // useResizeHandler={true}
    />
  );
};

export default SParameterMagnitudeGraph;
