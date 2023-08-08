import VoltageGraph from "./VoltageGraph";
import CurrentGraph from "./CurrentGraph";

interface TimeSignalsGraphProps {
  voltageData: any[];
  currentData: any[];
  visible: boolean;
}

const TimeSignalsGraph = (props: TimeSignalsGraphProps) => {
  const { voltageData, currentData, visible } = props;
  if (visible) {
    return (
      <>
        <VoltageGraph voltageData={voltageData} />
        <CurrentGraph currentData={currentData} />
      </>
    );
  } else {
    return null;
  }
};

export default TimeSignalsGraph;
