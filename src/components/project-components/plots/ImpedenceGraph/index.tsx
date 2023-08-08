import ImpedanceChart from "./ImpedanceChart";

interface ImpedanceGraphProps {
  impedanceData: any;
  visible: boolean;
}

const ImpedanceGraph = (props: ImpedanceGraphProps) => {
  const { impedanceData, visible } = props;
  if (visible) {
    return (
      <>
        <ImpedanceChart data={impedanceData} />
      </>
    );
  } else {
    return null;
  }
};

export default ImpedanceGraph;
