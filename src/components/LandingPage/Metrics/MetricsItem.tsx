import React from "react";

interface Props {
  subTitle: string;
  titleColor: string;
  title: string;
  desc: string;
}

const MetricsItem: React.FC<Props> = (props) => {
  return (
    <div className="flex flex-col items-center text-center gap-y-1">
      <h6 className="text-md text-gray-600">{props.subTitle}</h6>
      <h1
        className={`gradient_bg ${props.titleColor} text-txl font-semibold -tracking-[0.02em]`}
      >
        {props.title}
      </h1>
      <h5 className="text-lg font-semibold text-gray-900">{props.desc}</h5>
    </div>
  );
};

export default MetricsItem;
