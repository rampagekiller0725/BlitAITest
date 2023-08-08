import React from "react";
import MetricsItem from "./MetricsItem";
import myImage from "../../../images/workflow_mesh_img.png";

function Metrics() {
  return (
    <>
      <section className="py-24">
        <div className="max-w-[84rem] mx-auto px-8">
          <div className=" max-w-3xl text-left mb-16">
            <div className=" py-0.5 px-3 border-[2.2px] border-primary-600 rounded-full w-fit mb-4">
              <span className="text-sm font-medium text-primary-700">
                Metrics
              </span>
            </div>
            <h1 className=" text-tmd text-gray-900 font-semibold -tracking-[0.02em] mb-5">
              Build something great.
            </h1>
            <p className="text-xl text-gray-600">
              We've handled all the heavy lifting so you don't have to — obtain
              results at record-breaking rates and proceed to the prototyping
              phase, quicker than ever.
            </p>
          </div>

          <div className="flex gap-x-24">
            <div className="w-1/2">
              <div className="grid grid-cols-2 gap-x-8 gap-y-16">
                {/* <div className="flex flex-col items-center text-center gap-y-1">
                  <h6 className="text-md text-gray-600">Up to</h6>
                  <h1 className="gradient_bg blue text-txl font-semibold -tracking-[0.02em]">
                    1 billion
                  </h1>
                  <h5 className="text-lg font-semibold text-gray-900">
                    Mesh cells
                  </h5>
                </div> */}

                <MetricsItem
                  subTitle="Up to"
                  titleColor="blue"
                  title="1 trillion"
                  desc="Mesh cells"
                />
                <MetricsItem
                  subTitle="Computer vision AI trained on"
                  titleColor="red"
                  title="1,000+"
                  desc="Mesh models"
                />
                <MetricsItem
                  subTitle="Scale effortlessly from"
                  titleColor="purple"
                  title="4 to 128"
                  desc="vCPUs"
                />
                <MetricsItem
                  subTitle="Up to"
                  titleColor="brown"
                  title="1 TB"
                  desc="Instance memory"
                />
                <MetricsItem
                  subTitle="Scientifically transparent and"
                  titleColor="green"
                  title="100%"
                  desc="Open source"
                />
                <MetricsItem
                  subTitle="Rock-solid"
                  titleColor="gray"
                  title="AES-256"
                  desc="Encryption"
                />
              </div>
            </div>
            <div className="w-1/2 border-gray-900 rounded-[10px]">
              <img
                className="w-full h-full rounded-[10px]"
                src={myImage}
                alt="img"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Metrics;
