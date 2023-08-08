import React, { useState } from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import myImage from "../../../images/workflow_mesh_img.png";

function ContactUs() {
  // `value` will be the parsed phone number in E.164 format.
  // Example: "+12133734253".
  const [value, setValue] = useState();

  return (
    <>
      <section className="pt-12 pb-24 bg-gray-50">
        <div className="max-w-[84rem] mx-auto p-8">
          <div className="flex gap-x-16">
            <div className="w-1/2 border-gray-900 rounded-[10px]">
              <img
                className="w-full h-full rounded-[10px]"
                src={myImage}
                alt="img"
              />
            </div>
            <div className="w-1/2">
              <div className=" mb-12">
                <h1 className="text-tmd font-semibold text-gray-900 -tracking-[0.02em] mb-5">
                  Let's start your project.
                </h1>

                <p className=" text-xl text-gray-600">
                  Need help discovering the best solution for your application?
                  Our team of experienced engineersis here to help with a free
                  consultation.
                </p>
              </div>

              <form className="flex flex-col space-y-6">
                <div className="flex gap-x-8">
                  <div className="w-1/2">
                    <label
                      htmlFor="first_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      First name
                    </label>
                    <input
                      type="text"
                      id="first_name"
                      className="w-full h-11 px-3.5 mt-1.5 bg-white border border-gray-300 shadow-xs rounded-lg text-gray-600 text-md placeholder:text-gray-500 focus:ring-gray-300 focus:border-gray-300 focus-visible:ring-gray-300 focus-visible:outline-0"
                      placeholder="First name"
                      required
                    />
                  </div>

                  <div className="w-1/2">
                    <label
                      htmlFor="last_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Last name
                    </label>
                    <input
                      type="text"
                      id="last_name"
                      className="w-full h-11 px-3.5 mt-1.5 bg-white border border-gray-300 shadow-xs rounded-lg text-gray-600 text-md placeholder:text-gray-500 focus:ring-gray-300 focus:border-gray-300 focus-visible:ring-gray-300 focus-visible:outline-0"
                      placeholder="Last name"
                      required
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="work_email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Work email
                  </label>
                  <input
                    type="email"
                    id="work_email"
                    className="w-full h-11 px-3.5 mt-1.5 bg-white border border-gray-300 shadow-xs rounded-lg text-gray-600 text-md placeholder:text-gray-500 focus:ring-gray-300 focus:border-gray-300 focus-visible:ring-gray-300 focus-visible:outline-0"
                    placeholder="you@company.com"
                    required
                  />
                </div>

                <div className="w-full">
                  <label
                    htmlFor="phone_number"
                    className="text-sm font-medium text-gray-700"
                  >
                    Phone number <span className="font-normal">(optional)</span>
                  </label>
                  <div className="mt-1.5">
                    <PhoneInput
                      defaultCountry="US"
                      countrySelectProps={{ unicodeFlags: true }}
                      value={value}
                      onChange={setValue}
                      placeholder="+1 (555) 000-0000"
                      className="h-11 pl-3.5 bg-white border border-gray-300 shadow-xs rounded-lg text-gray-600 text-md"
                    />
                  </div>
                </div>

                <div className="w-full">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-gray-700"
                  >
                    Message <span className="font-normal">(optional)</span>
                  </label>
                  <textarea
                    type="text"
                    id="message"
                    className="resize-none w-full h-[134px] mt-1.5 px-3.5 pt-2 bg-white border border-gray-300 shadow-xs rounded-lg text-gray-600 text-md placeholder:text-gray-500 focus:ring-gray-300 focus:border-gray-300 focus-visible:ring-gray-300 focus-visible:outline-0"
                    placeholder="Leave us a message..."
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      type="checkbox"
                      value=""
                      className="w-5 h-5 border border-gray-300 rounded-md bg-white focus:ring-3 focus:ring-blue-300"
                      required
                    />
                  </div>
                  <label
                    htmlFor="remember"
                    className=" ml-3 text-sm text-gray-600"
                  >
                    You agree to our{" "}
                    <a
                      href="#abc"
                      className="underline underline-offset-4 decoration-1"
                    >
                      privacy policy
                    </a>
                    .
                  </label>
                </div>

                <button className="mt-8 w-full h-12 shadow-xs bg-primary-600 hover:bg-primary-700 active:bg-primary-800 hover:transition duration-150 shadow-lg hover:shadow-primary-600/50 rounded-lg text-md font-semibold text-white">
                  Send message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ContactUs;
