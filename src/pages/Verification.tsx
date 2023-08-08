import React, { useEffect } from "react";
import art from "../images/loginArt.png";
import logo from "../images/logo.svg";
// import googleIcon from "../images/google_icon.svg";
import mailIcon from "../images/mail_icon.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";

function Verification() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Verification | blit.ai`;
  });

  const handleSubmit = (evt: any) => {
    evt.preventDefault();
    const code = evt.target.code.value;
    const email = location.state.email;
    Auth.confirmSignUp(email, code)
      .then((data) => {
        if (data === "SUCCESS") {
          navigate("/projects", { replace: true });
        }
      })
      .catch((err) => {
        if (err.message.includes("Invalid verification code provided")) {
          alert("Invalid verification code. Please try again.");
        } else {
          console.log(err);
        }
      });
  };

  return (
    <>
      <div className="flex">
        {/* LEFT LOGIN */}
        <div className="w-1/2">
          {/* HEADER */}
          <div className="h-24 flex items-center pl-11">
            {/* LOGO */}
            <img src={logo} alt="logo" />
          </div>

          {/* CENTER CONTENT */}
          <div className="max-w-[360px] mx-auto py-[140px]">
            {/* FORM */}
            <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* INPUT */}
                <div className="w-full">
                  <label
                    htmlFor="code"
                    className="text-sm font-medium text-gray-700"
                  >
                    Verification code
                  </label>
                  <input
                    type="text"
                    name="code"
                    className="w-full h-11 px-3.5 mt-1.5 bg-white border border-gray-300 shadow-xs rounded-lg text-gray-600 text-md placeholder:text-gray-500 focus:ring-gray-300 focus:border-gray-300 focus-visible:ring-gray-300 focus-visible:outline-0"
                    placeholder="Enter verification code"
                    required
                  />
                </div>
              </div>

              {/* BUTTONS */}
              <div className="space-y-4">
                <button className="w-full h-11 shadow-xs bg-primary-600 hover:bg-primary-700 active:bg-primary-800 hover:transition duration-150 shadow-lg hover:shadow-primary-600/50 rounded-lg text-md font-semibold text-white">
                  Verify
                </button>

                {/* <button className="w-full h-11 bg-white border border-gray-300 shadow-xs rounded-lg text-md font-semibold text-gray-700 flex items-center justify-center">
                  <img className="mr-3" src={googleIcon} alt="google-icon" />
                  Sign up with Google
                </button> */}
              </div>
            </form>
          </div>

          {/* FOOTER */}
          <div className="h-24 flex items-center justify-between px-8 text-sm text-gray-600">
            <div>© 2023 blit.ai - All rights reserved.</div>
            <div className="flex items-center">
              <img className="mr-2" src={mailIcon} alt="mail-icon" />
              hello@blit.ai
            </div>
          </div>
        </div>

        {/* RIGHT ART */}
        <div className="w-1/2">
          <img className="w-full h-full object-cover" src={art} alt="art" />
        </div>
      </div>
    </>
  );
}

export default Verification;
