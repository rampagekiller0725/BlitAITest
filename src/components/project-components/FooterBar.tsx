import { useAppSelector } from "state/hooks";
import { selectGeneratedMesh } from "state/reducers/generatedMeshSlice";
import { selectClassifiedMesh } from "state/reducers/classifiedMeshSlice";
import "./FooterBar.css";

export default function FooterBar() {
  const generatedMesh = useAppSelector(selectGeneratedMesh);
  const classifiedMesh = useAppSelector(selectClassifiedMesh);

  const formatNumberWithCommas = (number: number) => {
    return number.toLocaleString();
  };

  function estimateTimestep(generatedMesh: {
    x: number[];
    y: number[];
    z: number[];
  }) {
    const c = 299792458;

    let deltaX = Math.min(
      ...adjacentDifferences(generatedMesh.x.map((x) => x))
    );
    let deltaY = Math.min(
      ...adjacentDifferences(generatedMesh.y.map((y) => y))
    );
    let deltaZ = Math.min(
      ...adjacentDifferences(generatedMesh.z.map((z) => z))
    );

    let deltaT =
      1 / (c * (1 / deltaX ** 2 + 1 / deltaY ** 2 + 1 / deltaZ ** 2));

    let timestep = `${Number(deltaT.toExponential().split("e")[0]).toFixed(
      2
    )}e${deltaT.toExponential().split("e")[1]} sec`;
    return timestep;
  }

  function adjacentDifferences(arr: number[]) {
    let differences = [];
    for (let i = 1; i < arr.length; i++) {
      differences.push(Math.abs(arr[i] - arr[i - 1]));
    }
    return differences;
  }

  return (
    <div
      className="footer-bar h-10 MuiBox-root css-38zrbw"
      style={{ display: "flex", justifyContent: "space-between" }}
    >
      <div>
        {generatedMesh ? (
          <p>
            Mesh size: {formatNumberWithCommas(generatedMesh?.x.length)} ×{" "}
            {formatNumberWithCommas(generatedMesh?.y.length)} ×{" "}
            {formatNumberWithCommas(generatedMesh?.z.length)} ={" "}
            {formatNumberWithCommas(
              generatedMesh?.x.length *
                generatedMesh?.y.length *
                generatedMesh?.z.length
            )}
            {" cells"}
          </p>
        ) : (
          <p>Mesh size: -</p>
        )}
      </div>
      <div>
        {generatedMesh ? (
          <p>Estimated timestep: {estimateTimestep(generatedMesh)}</p>
        ) : (
          <p>Estimated timestep: -</p>
        )}
      </div>
      <div
        className="scrollable leading-6"
        style={{
          whiteSpace: "nowrap",
          overflowX: "auto",
          overflowY: "auto",
          maxWidth: "30%",
          height: "3vh",
        }}
      >
        {classifiedMesh ? (
          <p className="mb-2">
            AI quality classification:{" "}
            <span
              dangerouslySetInnerHTML={{
                __html: classifiedMesh.classification,
              }}
            />
          </p>
        ) : (
          <p>AI quality classification: -</p>
        )}
      </div>
    </div>
  );
}
