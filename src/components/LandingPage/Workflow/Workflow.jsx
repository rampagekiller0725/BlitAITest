import { useState } from "react";
import myImage1 from "../../../images/workflow_modeling_img.png";
import myImage2 from "../../../images/workflow_mesh_img.png";
import myImage3 from "../../../images/workflow_results_img.png";

function Workflow() {
  const [activeImg1, setActiveImg1] = useState(true);
  const [activeImg2, setActiveImg2] = useState(false);
  const [activeImg3, setActiveImg3] = useState(false);

  const ActiveBox1 = () => {
    setActiveImg1(true);
    setActiveImg2(false);
    setActiveImg3(false);
  };

  const ActiveBox2 = () => {
    setActiveImg1(false);
    setActiveImg2(true);
    setActiveImg3(false);
  };

  const ActiveBox3 = () => {
    setActiveImg1(false);
    setActiveImg2(false);
    setActiveImg3(true);
  };

  return (
    <>
      <section className="py-24 bg-gray-50">
        <div className="max-w-[84rem] mx-auto px-8">
          {/* HEADING */}
          <div className=" max-w-3xl m-auto text-center mb-16">
            <div className=" py-0.5 px-3 border-[2.2px] border-primary-600 rounded-full w-fit mx-auto mb-4">
              <span className="text-sm font-medium text-primary-700">
                Workflow
              </span>
            </div>
            <h1 className=" text-tmd text-gray-900 font-semibold -tracking-[0.02em] mb-5">
              Countless cutting-edge utilities.
              <br />
              One seamless experience.
            </h1>
            <p className="text-xl text-gray-600">
              Discover the easiest, fastest and most secure way to carry out RF
              simulations.
            </p>
          </div>

          <div>
            <div className="w-full h-[387px] max-w-3xl m-auto border-4 border-gray-900 rounded-[10px] mb-20">
              {/* IMAGE */}
              <img
                src={
                  activeImg1 === true
                    ? myImage1
                    : activeImg2 === true
                    ? myImage2
                    : activeImg3 === true
                    ? myImage3
                    : myImage1
                }
                alt="img"
                className=" w-full h-full object-fill rounded-[10px]"
              />
            </div>

            <div className=" grid grid-cols-3">
              {/* WORKFLOW BOX */}
              <div
                className={
                  activeImg1
                    ? "border-t-4 border-primary-600 pt-6 px-4 cursor-pointer"
                    : "border-t-4 border-gray-100 pt-6 px-4 cursor-pointer"
                }
                onClick={ActiveBox1}
              >
                <div className="flex flex-col items-center justify-center text-center gap-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Robust 3D modeling interface
                  </h3>
                  <p className="text-md text-gray-600">
                    Whether you're building a geometry from scratch or importing
                    an existing CAD model (STEP/STL), our versatile modeling
                    interface has you covered.
                  </p>
                </div>
              </div>

              {/* WORKFLOW BOX */}
              <div
                className={
                  activeImg2
                    ? "border-t-4 border-primary-600 pt-6 px-4 cursor-pointer"
                    : "border-t-4 border-gray-100 pt-6 px-4 cursor-pointer"
                }
                onClick={ActiveBox2}
              >
                <div className="flex flex-col items-center justify-center text-center gap-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    State-of-the-art AI mesh generation
                  </h3>
                  <p className="text-md text-gray-600">
                    Forget about time-consuming convergence analysis. The most
                    innovative mesh quality classification AI, right at your
                    fingertips.
                  </p>
                </div>
              </div>

              {/* WORKFLOW BOX */}
              <div
                className={
                  activeImg3
                    ? "border-t-4 border-primary-600 pt-6 px-4 cursor-pointer"
                    : "border-t-4 border-gray-100 pt-6 px-4 cursor-pointer"
                }
                onClick={ActiveBox3}
              >
                <div className="flex flex-col items-center justify-center text-center gap-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Modular result visualization interface
                  </h3>
                  <p className="text-md text-gray-600">
                    Our platform enables you to visualize every result you might
                    need. From S-Parameters and Smith charts, to 2D/3D fields
                    and radiation patterns.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Workflow;
