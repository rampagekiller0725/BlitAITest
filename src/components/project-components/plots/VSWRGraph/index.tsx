import Plot from "react-plotly.js";

interface VSWRGraphProps {
  data: any;
  visible: boolean;
}

const VSWRGraph = (props: VSWRGraphProps) => {
  const { data, visible } = props;
  if (visible) {
    // let combinedYs: number[] = [];
    // for (let i = 0; i < data.length; i++) {
    //   combinedYs = combinedYs.concat(data[i].y);
    // }
    // const max = Math.min(Math.max(...combinedYs) * 1.2, 200);
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
            title: "VSWR",
            // autorange: false,
            // range: [0, max],
            // type: "linear",
          },
          title: "Voltage Standing Wave Ratio",
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
  } else {
    return null;
  }
};

export default VSWRGraph;
