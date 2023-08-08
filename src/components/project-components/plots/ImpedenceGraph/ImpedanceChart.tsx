import Plot from "react-plotly.js";

interface ImpedanceGraphProps {
  data: any;
}

const ImpedanceChart = (props: ImpedanceGraphProps) => {
  const { data } = props;

  let combinedYs: number[] = [];
  for (let i = 0; i < data.length; i++) {
    combinedYs = combinedYs.concat(data[i].y);
  }

  const min = Math.max(Math.min(...combinedYs) * 1.2, -10000);
  const max = Math.min(Math.max(...combinedYs) * 1.2, 10000);

  return (
    <Plot
      data={data}
      layout={{
        width: window.innerWidth * 0.75,
        height: window.innerHeight * 0.75,
        autosize: true,
        xaxis: {
          title: "Frequency (MHz)",
        },
        yaxis: {
          title: "Impedance (\u03A9)",
          autorange: false,
          range: [min, max],
          type: "linear",
        },
        title: "Complex Z-Parameters",
      }}
      config={{
        responsive: true,
        displaylogo: false,
        doubleClick: "reset",
      }}
      className="plot-style"
      useResizeHandler={true}
    />
  );
};

export default ImpedanceChart;
