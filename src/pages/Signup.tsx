import React, { useEffect } from "react";
import art from "../images/loginArt.png";
import logo from "../images/logo.svg";
// import googleIcon from "../images/google_icon.svg";
import mailIcon from "../images/mail_icon.svg";
import { Link, useNavigate } from "react-router-dom";
import { Auth } from "aws-amplify";

function Signup() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `Sign up | blit.ai`;
  });

  const handleSubmit = (evt: any) => {
    evt.preventDefault();
    const email = evt.target.email.value;
    const password = evt.target.password.value;
    Auth.signUp(email, password)
      .then((data) => {
        navigate("/verify", {
          replace: true,
          state: { email: data.user.getUsername() },
        });
      })
      .catch((err) => {
        if (
          err.message.includes("Password did not conform with policy") ||
          err.message.includes("failed to satisfy constraint")
        ) {
          alert("Password must be at least 6 characters long.");
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
            {/* TOP TITLE */}
            <div className="text-left mb-8">
              <h2 className=" text-tsm font-semibold text-gray-900 mb-3">
                Sign up
              </h2>
              <p className=" text-md text-gray-500">
                Create an account and run 10 free simulations. No credit card
                required.
              </p>
            </div>

            {/* FORM */}
            <form className="space-y-6 mb-8" onSubmit={handleSubmit}>
              <div className="space-y-5">
                {/* INPUT  */}
                <div className="w-full">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700"
                  >
                    Email*
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full h-11 px-3.5 mt-1.5 bg-white border border-gray-300 shadow-xs rounded-lg text-gray-600 text-md placeholder:text-gray-500 focus:ring-gray-300 focus:border-gray-300 focus-visible:ring-gray-300 focus-visible:outline-0"
                    placeholder="Enter your work email"
                    required
                  />
                </div>

                {/* INPUT */}
                <div className="w-full">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password*
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="w-full h-11 px-3.5 mt-1.5 bg-white border border-gray-300 shadow-xs rounded-lg text-gray-600 text-md placeholder:text-gray-500 focus:ring-gray-300 focus:border-gray-300 focus-visible:ring-gray-300 focus-visible:outline-0"
                    placeholder="Create a password"
                    required
                  />
                  <span className=" text-sm text-gray-600 mt-1.5">
                    Must be at least 6 characters long.
                  </span>
                </div>
              </div>

              {/* CHECKBOX WITH FORET PASSWORD */}
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  <div className="flex items-center">
                    <input
                      name="tos"
                      type="checkbox"
                      value=""
                      className="w-5 h-5 border border-gray-300 rounded-md bg-white focus:ring-3 focus:ring-blue-300"
                      required
                    />
                  </div>
                  <label
                    htmlFor="tos"
                    className=" ml-3 -mt-0.5 text-md text-gray-600"
                  >
                    You agree to our{" "}
                    <a href="#abc" className="underline underline-offset-4">
                      terms of service
                    </a>{" "}
                    and{" "}
                    <a href="#abc" className="underline underline-offset-4">
                      privacy policy
                    </a>
                    .
                  </label>
                </div>
              </div>

              {/* BUTTONS */}
              <div className="space-y-4">
                <button className="w-full h-11 shadow-xs bg-primary-600 hover:bg-primary-700 active:bg-primary-800 hover:transition duration-150 shadow-lg hover:shadow-primary-600/50 rounded-lg text-md font-semibold text-white">
                  Get started
                </button>

                {/* <button className="w-full h-11 bg-white border border-gray-300 shadow-xs rounded-lg text-md font-semibold text-gray-700 flex items-center justify-center">
                  <img className="mr-3" src={googleIcon} alt="google-icon" />
                  Sign up with Google
                </button> */}
              </div>
            </form>

            {/* SIGNUP BUTTON */}
            <div className="flex items-center justify-center text-sm">
              <span className="text-gray-600 mr-1">
                Already have an account?
              </span>
              <Link to="/login" className="text-primary-700 font-semibold">
                Log in
              </Link>
            </div>
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

export default Signup;
