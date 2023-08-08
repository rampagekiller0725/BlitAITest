import React, { useState, useEffect } from "react";
import header_img from "../../images/header_img.png";

function Header() {
  const [highlightedText, setHighlightedText] = useState("fastest");
  const [isAnimating, setAnimating] = useState(false);

  useEffect(() => {
    const texts = [
      "fastest",
      "most secure",
      "scientifically transparent",
      "open-source",
    ];
    let currentTextIndex = 0;

    const interval = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        currentTextIndex =
          currentTextIndex + 1 === texts.length ? 0 : currentTextIndex + 1;
        setHighlightedText(texts[currentTextIndex]);
        setAnimating(false);
      }, 200);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section className="pt-44 pb-24 overflow-x-hidden">
        <header className="max-w-[84rem] mx-auto px-8">
          <div className="flex gap-x-16">
            <div className="w-1/2 space-y-6">
              <h1 className="gradient_bg black max-w-xl text-txl font-bold -tracking-[0.02em]">
                It's time to ditch CST and HFSS.
              </h1>
              <p className="max-w-[490px] text-xl text-gray-600">
                Introducing the world's <span className="font-medium">#1 </span>{" "}
                <span
                  className={`font-medium animated-text ${
                    isAnimating ? "fade-out" : "fade-in"
                  }`}
                >
                  {highlightedText}
                </span>{" "}
                <br></br>
                cloud-based RF simulation platform,<br></br>powered by{" "}
                <span className="font-medium">computer vision AI</span>.
              </p>

              <form className="flex items-stretch gap-x-4">
                <div className="flex flex-col">
                  <input
                    type="email"
                    className=" text-md text-gray-600 w-[360px] h-12 bg-white border border-gray-300 rounded-lg px-3.5 mb-1.5 placeholder:text-gray-500 focus:ring-gray-300 focus:border-gray-300 focus-visible:ring-gray-300 focus-visible:outline-0"
                    placeholder="Enter your work email"
                  />
                  <span className=" text-sm text-gray-400">
                    By signing up, you agree to our{" "}
                    <a
                      href="#abc"
                      className="underline underline-offset-4 decoration-1"
                    >
                      privacy policy
                    </a>
                    .
                  </span>
                </div>
                <button className="w-[133px] h-12 rounded-lg bg-primary-600 hover:bg-primary-700 active:bg-primary-800 hover:transition duration-150 shadow-lg hover:shadow-primary-600/50 shadow-xs text-md font-semibold text-white">
                  Join waitlist
                </button>
              </form>

              <div>
                <h6 className=" text-md font-medium text-gray-600 mb-3">
                  Accelerate your RF design workflow from{" "}
                  <span className="line-through">months</span> to days:
                </h6>
                <div className=" space-y-4">
                  <div className="flex items-center">
                    {/* <div dangerouslySetInnerHTML={{ __html: GeometryIcon }} /> */}
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="32" height="32" rx="16" fill="#D1FADF" />
                      <path
                        d="M23.0833 12.3949L16 16.4375M16 16.4375L8.91664 12.3949M16 16.4375L16 24.5702M23.5 19.9119V12.9631C23.5 12.6697 23.5 12.5231 23.4579 12.3923C23.4207 12.2766 23.3599 12.1703 23.2795 12.0807C23.1886 11.9794 23.0638 11.9082 22.8142 11.7657L16.6475 8.24631C16.4112 8.11143 16.293 8.04399 16.1679 8.01755C16.0571 7.99415 15.9429 7.99415 15.8321 8.01755C15.707 8.04399 15.5888 8.11143 15.3525 8.24631L9.18581 11.7657C8.93621 11.9082 8.8114 11.9794 8.72053 12.0807C8.64013 12.1703 8.57929 12.2766 8.54207 12.3923C8.5 12.5231 8.5 12.6698 8.5 12.9631V19.9119C8.5 20.2053 8.5 20.3519 8.54207 20.4827C8.57929 20.5984 8.64013 20.7047 8.72053 20.7943C8.8114 20.8956 8.93621 20.9668 9.18581 21.1093L15.3525 24.6287C15.5888 24.7636 15.707 24.831 15.8321 24.8574C15.9429 24.8809 16.0571 24.8809 16.1679 24.8574C16.293 24.831 16.4112 24.7636 16.6475 24.6287L22.8142 21.1093C23.0638 20.9668 23.1886 20.8956 23.2795 20.7943C23.3599 20.7047 23.4207 20.5984 23.4579 20.4827C23.5 20.3519 23.5 20.2053 23.5 19.9119Z"
                        stroke="#12B76A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <h5 className=" ml-3 text-lg text-gray-600">
                      Upload CAD or build geometry model
                    </h5>
                  </div>

                  <div className="flex items-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="32" height="32" rx="16" fill="#D1FADF" />
                      <path
                        d="M20.4706 13.2222V11.4444C20.4706 8.98985 18.4954 7 16.0588 7C13.6223 7 11.6471 8.98985 11.6471 11.4444V13.2222M16.0588 17.2222V19M13.2353 23H18.8824C20.3648 23 21.1061 23 21.6723 22.7094C22.1704 22.4537 22.5754 22.0457 22.8291 21.544C23.1176 20.9735 23.1176 20.2268 23.1176 18.7333V17.4889C23.1176 15.9954 23.1176 15.2487 22.8291 14.6782C22.5754 14.1765 22.1704 13.7685 21.6723 13.5129C21.1061 13.2222 20.3648 13.2222 18.8824 13.2222H13.2353C11.7528 13.2222 11.0116 13.2222 10.4453 13.5129C9.94724 13.7685 9.54229 14.1765 9.28851 14.6782C9 15.2487 9 15.9954 9 17.4889V18.7333C9 20.2268 9 20.9735 9.28851 21.544C9.54229 22.0457 9.94724 22.4537 10.4453 22.7094C11.0116 23 11.7528 23 13.2353 23Z"
                        stroke="#12B76A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <h5 className=" ml-3 text-lg text-gray-600">
                      Run simulation on our encrypted compute nodes
                    </h5>
                  </div>

                  <div className="flex items-center">
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <rect width="32" height="32" rx="16" fill="#D1FADF" />
                      <path
                        d="M22.5 22.5H10.6556C10.2511 22.5 10.0488 22.5 9.89434 22.4213C9.75845 22.352 9.64796 22.2416 9.57872 22.1057C9.5 21.9512 9.5 21.7489 9.5 21.3444V9.5M21.7778 13.1111L18.9475 16.1319C18.8402 16.2464 18.7866 16.3036 18.7219 16.3332C18.6648 16.3593 18.6018 16.3701 18.5393 16.3645C18.4684 16.3581 18.3988 16.3219 18.2596 16.2497L15.9071 15.0281C15.7678 14.9558 15.6982 14.9197 15.6274 14.9133C15.5648 14.9077 15.5019 14.9184 15.4448 14.9445C15.3801 14.9741 15.3264 15.0314 15.2192 15.1459L12.3889 18.1667"
                        stroke="#12B76A"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>

                    <h5 className=" ml-3 text-lg text-gray-600">
                      Visualize your simulation results securely
                    </h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2 relative rounded-[10px]">
              {/* <div className=" absolute w-screen bg-gray-900 rounded-[10px] h-full">
              Do something
            </div> */}
              <div className=" absolute w-[1073px] border-4 border-gray-900 rounded-[10px] h-full">
                <img
                  className="w-full h-full object-contain object-left rounded-[10px]"
                  src={header_img}
                  alt="header-img"
                />
              </div>
            </div>
          </div>
        </header>
      </section>
    </>
  );
}

export default Header;
