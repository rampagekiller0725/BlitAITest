import * as React from "react";
import { useEffect } from "react";
import { Range, getTrackBackground } from "react-range";

const ReactRangeSlider: React.FC<{
  rtl: boolean;
  minValue: number;
  maxValue: number;
  defualtValue: number[];
  updateValue: (value: any) => void;
}> = ({ rtl, minValue, maxValue, defualtValue, updateValue }) => {
  const STEP = 1;
  const MIN = minValue;
  const MAX = maxValue;

  const [values, setValues] = React.useState(defualtValue);

  useEffect(() => {
    updateValue(values[0]);
  }, [values[0]]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
      }}
    >
      <Range
        values={values}
        step={STEP}
        min={MIN}
        max={MAX}
        rtl={rtl}
        onChange={(values) => setValues(values)}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: "36px",
              display: "flex",
              width: "100%",
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: "8px",
                width: "100%",
                borderRadius: "100px",
                background: getTrackBackground({
                  values,
                  colors: ["#0086C9", "#EAECF0"],
                  min: MIN,
                  max: MAX,
                  rtl,
                }),
                alignSelf: "center",
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props, isDragged }) => (
          <div
            {...props}
            style={{
              ...props.style,
              height: "24px",
              width: "24px",
              borderRadius: "100px",
              border: "1.5px solid #0086C9",
              backgroundColor: "#FFF",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow:
                "0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: "-26px",
                color: "#344054",
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "20px",
                backgroundColor: "transparent",
              }}
            >
              {values[0]}
              <span className="ml-1">CPW</span>
            </div>
            <div
              style={{
                height: "16px",
                width: "5px",
                backgroundColor: isDragged ? "transparent" : "transparent",
              }}
            />
          </div>
        )}
      />
    </div>
  );
};

export default ReactRangeSlider;
