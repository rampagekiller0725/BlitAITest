import SParameterMagnitudeGraph from "./SParameterMagnitudeGraph";
import SParameterPhaseGraph from "./SParameterPhaseGraph";
import SmithChart from "../SParameterGraph/SmithChart";

interface SParameterGraphProps {
  magnitudeData: any[];
  phaseData: any[];
  smithData: any[];
  visible: boolean;
}

const SParameterGraph = (props: SParameterGraphProps) => {
  const { magnitudeData, phaseData, smithData, visible } = props;
  if (visible) {
    return (
      <>
        <SParameterMagnitudeGraph magnitudeData={magnitudeData} />
        <SParameterPhaseGraph phaseData={phaseData} />
        <SmithChart smithData={smithData} />
      </>
    );
  } else {
    return null;
  }
};

export default SParameterGraph;
