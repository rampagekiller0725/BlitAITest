import Plot from "react-plotly.js";

interface SmithChartProps {
  smithData: any;
}

const SmithChart = (props: SmithChartProps) => {
  const { smithData } = props;
  return (
    <Plot
      data={smithData}
      layout={{
        showlegend: true,
        width: window.innerWidth * 0.75,
        height: window.innerHeight * 0.75,
        autosize: true,
        title: "Smith Chart",
        margin: {
          t: 60,
          b: 30,
          r: 30,
          l: 30,
        },
      }}
      config={{
        responsive: true,
        displaylogo: false,
      }}
      className="plot-style"
      useResizeHandler={true}
    />
  );
};

export default SmithChart;
