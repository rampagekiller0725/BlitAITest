import React from "react";

function Features() {
  const svgData1 =
    '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="4" y="4" width="48" height="48" rx="24" fill="#F4EBFF"/> <path d="M21 28C21 24.134 24.134 21 28 21M32.4999 23.5L27.9999 28M38 28C38 33.5228 33.5228 38 28 38C22.4772 38 18 33.5228 18 28C18 22.4772 22.4772 18 28 18C33.5228 18 38 22.4772 38 28ZM29 28C29 28.5523 28.5523 29 28 29C27.4477 29 27 28.5523 27 28C27 27.4477 27.4477 27 28 27C28.5523 27 29 27.4477 29 28Z" stroke="#7F56D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <rect x="4" y="4" width="48" height="48" rx="24" stroke="#F9F5FF" stroke-width="8"/> </svg> ';

  const svgData2 =
    '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="4" y="4" width="48" height="48" rx="24" fill="#F4EBFF"/> <path d="M25.0521 27.5303L27.073 29.5512L31.6199 25.0043M36.1668 28.0356C36.1668 32.9952 30.757 36.6024 28.7887 37.7507C28.565 37.8812 28.4531 37.9464 28.2953 37.9803C28.1728 38.0066 27.9941 38.0066 27.8715 37.9803C27.7137 37.9464 27.6018 37.8812 27.3781 37.7507C25.4098 36.6024 20 32.9952 20 28.0356V23.2033C20 22.3954 20 21.9915 20.1321 21.6443C20.2488 21.3376 20.4385 21.0639 20.6847 20.8469C20.9634 20.6013 21.3416 20.4595 22.0981 20.1758L27.5158 18.1442C27.7258 18.0654 27.8309 18.026 27.9389 18.0104C28.0347 17.9965 28.1321 17.9965 28.2279 18.0104C28.336 18.026 28.441 18.0654 28.6511 18.1442L34.0688 20.1758C34.8252 20.4595 35.2034 20.6013 35.4821 20.8469C35.7283 21.0639 35.918 21.3376 36.0347 21.6443C36.1668 21.9915 36.1668 22.3954 36.1668 23.2033V28.0356Z" stroke="#7F56D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <rect x="4" y="4" width="48" height="48" rx="24" stroke="#F9F5FF" stroke-width="8"/> </svg> ';

  const svgData3 =
    '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="4" y="4" width="48" height="48" rx="24" fill="#F4EBFF"/> <path d="M25 18V20M31 18V20M25 36V38M31 36V38M36 25H38M36 30H38M18 25H20M18 30H20M24.8 36H31.2C32.8802 36 33.7202 36 34.362 35.673C34.9265 35.3854 35.3854 34.9265 35.673 34.362C36 33.7202 36 32.8802 36 31.2V24.8C36 23.1198 36 22.2798 35.673 21.638C35.3854 21.0735 34.9265 20.6146 34.362 20.327C33.7202 20 32.8802 20 31.2 20H24.8C23.1198 20 22.2798 20 21.638 20.327C21.0735 20.6146 20.6146 21.0735 20.327 21.638C20 22.2798 20 23.1198 20 24.8V31.2C20 32.8802 20 33.7202 20.327 34.362C20.6146 34.9265 21.0735 35.3854 21.638 35.673C22.2798 36 23.1198 36 24.8 36ZM26.6 31H29.4C29.9601 31 30.2401 31 30.454 30.891C30.6422 30.7951 30.7951 30.6422 30.891 30.454C31 30.2401 31 29.9601 31 29.4V26.6C31 26.0399 31 25.7599 30.891 25.546C30.7951 25.3578 30.6422 25.2049 30.454 25.109C30.2401 25 29.9601 25 29.4 25H26.6C26.0399 25 25.7599 25 25.546 25.109C25.3578 25.2049 25.2049 25.3578 25.109 25.546C25 25.7599 25 26.0399 25 26.6V29.4C25 29.9601 25 30.2401 25.109 30.454C25.2049 30.6422 25.3578 30.7951 25.546 30.891C25.7599 31 26.0399 31 26.6 31Z" stroke="#7F56D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <rect x="4" y="4" width="48" height="48" rx="24" stroke="#F9F5FF" stroke-width="8"/> </svg> ';

  const svgData4 =
    '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="4" y="4" width="48" height="48" rx="24" fill="#F4EBFF"/> <path d="M27.9999 28.0001H28.0108M31.8451 31.8452C26.7484 36.9418 20.8953 39.352 18.7717 37.2284C16.6481 35.1048 19.0582 29.2516 24.1548 24.155C29.2515 19.0584 35.1046 16.6482 37.2282 18.7718C39.3518 20.8954 36.9417 26.7486 31.8451 31.8452ZM31.845 24.1548C36.9416 29.2514 39.3518 35.1046 37.2282 37.2282C35.1046 39.3518 29.2514 36.9416 24.1548 31.845C19.0582 26.7484 16.648 20.8952 18.7716 18.7716C20.8952 16.648 26.7484 19.0582 31.845 24.1548ZM28.5437 28.0001C28.5437 28.3004 28.3003 28.5439 27.9999 28.5439C27.6996 28.5439 27.4562 28.3004 27.4562 28.0001C27.4562 27.6998 27.6996 27.4563 27.9999 27.4563C28.3003 27.4563 28.5437 27.6998 28.5437 28.0001Z" stroke="#7F56D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <rect x="4" y="4" width="48" height="48" rx="24" stroke="#F9F5FF" stroke-width="8"/> </svg> ';

  const svgData5 =
    '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="4" y="4" width="48" height="48" rx="24" fill="#F4EBFF"/> <path d="M19 32V23.2C19 22.0799 19 21.5198 19.218 21.092C19.4097 20.7157 19.7157 20.4097 20.092 20.218C20.5198 20 21.0799 20 22.2 20H33.8C34.9201 20 35.4802 20 35.908 20.218C36.2843 20.4097 36.5903 20.7157 36.782 21.092C37 21.5198 37 22.0799 37 23.2V32H31.6627C31.4182 32 31.2959 32 31.1808 32.0276C31.0787 32.0521 30.9812 32.0925 30.8917 32.1474C30.7908 32.2092 30.7043 32.2957 30.5314 32.4686L30.4686 32.5314C30.2957 32.7043 30.2092 32.7908 30.1083 32.8526C30.0188 32.9075 29.9213 32.9479 29.8192 32.9724C29.7041 33 29.5818 33 29.3373 33H26.6627C26.4182 33 26.2959 33 26.1808 32.9724C26.0787 32.9479 25.9812 32.9075 25.8917 32.8526C25.7908 32.7908 25.7043 32.7043 25.5314 32.5314L25.4686 32.4686C25.2957 32.2957 25.2092 32.2092 25.1083 32.1474C25.0188 32.0925 24.9213 32.0521 24.8192 32.0276C24.7041 32 24.5818 32 24.3373 32H19ZM19 32C18.4477 32 18 32.4477 18 33V33.3333C18 33.9533 18 34.2633 18.0681 34.5176C18.2531 35.2078 18.7922 35.7469 19.4824 35.9319C19.7367 36 20.0467 36 20.6667 36H35.3333C35.9533 36 36.2633 36 36.5176 35.9319C37.2078 35.7469 37.7469 35.2078 37.9319 34.5176C38 34.2633 38 33.9533 38 33.3333C38 33.0233 38 32.8683 37.9659 32.7412C37.8735 32.3961 37.6039 32.1265 37.2588 32.0341C37.1317 32 36.9767 32 36.6667 32H36" stroke="#7F56D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <rect x="4" y="4" width="48" height="48" rx="24" stroke="#F9F5FF" stroke-width="8"/> </svg> ';

  const svgData6 =
    '<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="4" y="4" width="48" height="48" rx="24" fill="#F4EBFF"/> <path d="M38 37V35C38 33.1362 36.7252 31.5701 35 31.126M31.5 19.2908C32.9659 19.8841 34 21.3213 34 23C34 24.6787 32.9659 26.1159 31.5 26.7092M33 37C33 35.1362 33 34.2044 32.6955 33.4693C32.2895 32.4892 31.5108 31.7105 30.5307 31.3045C29.7956 31 28.8638 31 27 31H24C22.1362 31 21.2044 31 20.4693 31.3045C19.4892 31.7105 18.7105 32.4892 18.3045 33.4693C18 34.2044 18 35.1362 18 37M29.5 23C29.5 25.2091 27.7091 27 25.5 27C23.2909 27 21.5 25.2091 21.5 23C21.5 20.7909 23.2909 19 25.5 19C27.7091 19 29.5 20.7909 29.5 23Z" stroke="#7F56D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/> <rect x="4" y="4" width="48" height="48" rx="24" stroke="#F9F5FF" stroke-width="8"/> </svg> ';
  return (
    <>
      <section className="py-24">
        <div className="max-w-[84rem] mx-auto px-8">
          <div className=" max-w-3xl m-auto text-center mb-16">
            <div className=" py-0.5 px-3 border-[2.2px] border-primary-600 rounded-full w-fit mx-auto mb-4">
              <span className="text-sm font-medium text-primary-700">
                Features
              </span>
            </div>
            <h1 className=" text-tmd text-gray-900 font-semibold -tracking-[0.02em] mb-5">
              Revamp your wireless design process by 10X.
            </h1>
            <p className="text-xl text-gray-600">
              Simulate antennas, filters, cables, waveguides and microwave
              components like never before. From consumer electronics and IoT,
              to aircrafts and satellites.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-x-8 gap-y-16 px-8">
            {/* FEATURE BOX */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-5">
                <div dangerouslySetInnerHTML={{ __html: svgData1 }} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Results in record time
              </h3>

              <p className="text-md text-gray-600">
                Our high-performance computing nodes have been uniquely designed
                and optimized to run our E/M solver at blazing speeds.
              </p>
            </div>

            {/* FEATURE BOX */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-5">
                <div dangerouslySetInnerHTML={{ __html: svgData2 }} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Zero-knowledge encryption
              </h3>

              <p className="text-md text-gray-600">
                Designed with user-controlled end-to-end encryption, your data
                is mathematically secure. We do not have access to your
                simulations.
              </p>
            </div>

            {/* FEATURE BOX */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-5">
                <div dangerouslySetInnerHTML={{ __html: svgData3 }} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Advanced AI meshing
              </h3>

              <p className="text-md text-gray-600">
                Experience the most advanced mesh-generation algorithm for
                electromagnetics, powered by computer vision. Trained on 1,000+
                AI models.
              </p>
            </div>

            {/* FEATURE BOX */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-5">
                <div dangerouslySetInnerHTML={{ __html: svgData4 }} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Research-proven accuracy
              </h3>

              <p className="text-md text-gray-600">
                The only fully open-source and scientifically transparent solver
                commercially available, accurately matching measurements{" "}
                <a href="#abc" className=" cursor-pointer text-purple-700">
                  [1]
                </a>
                ,
                <a href="#abc" className="cursor-pointer text-purple-700">
                  {" "}
                  [2]
                </a>
                .
              </p>
            </div>

            {/* FEATURE BOX */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-5">
                <div dangerouslySetInnerHTML={{ __html: svgData5 }} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Cross-platform support
              </h3>

              <p className="text-md text-gray-600">
                Whether you're on Windows, macOS, or Linux, carry out your
                simulations directly from the browser. No download/installation
                necessary.
              </p>
            </div>

            {/* FEATURE BOX */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="mb-5">
                <div dangerouslySetInnerHTML={{ __html: svgData6 }} />
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Collaborative design
              </h3>

              <p className="text-md text-gray-600">
                Say goodbye to remote desktop headaches. No matter the size of
                your team, our platform enables everyone to be on the same page
                and in the loop.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Features;
