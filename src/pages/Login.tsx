import React, { useEffect, useState } from "react";
import art from "../images/loginArt.png";
import logo from "../images/logo.svg";
// import googleIcon from "../images/google_icon.svg";
import mailIcon from "../images/mail_icon.svg";
import { Link } from "react-router-dom";
import { Auth } from "aws-amplify";
import { useAppDispatch } from "state/hooks";
import { setTokens, setUserData } from "state/reducers/authSlice";

function Login() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = `Log in | blit.ai`;
  });

  const handleSubmit = (evt: any) => {
    setIsLoading(true);
    evt.preventDefault();
    const email = evt.target.email.value;
    const password = evt.target.password.value;
    Auth.signIn(email, password)
      .then((user: any) => {
        localStorage.setItem(
          "idToken",
          user.signInUserSession.idToken.jwtToken
        );
        dispatch(
          setUserData({
            username: user.username,
            name: "",
            email: user.attributes.email,
          })
        );
        dispatch(
          setTokens({
            idToken: user.signInUserSession.idToken.jwtToken,
          })
        );
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
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
            <div className="text-center mb-8">
              <h2 className=" text-tsm font-semibold text-gray-900 mb-3">
                Log in to your account
              </h2>
              <p className=" text-md text-gray-500">
                Welcome back! Please enter your details.
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
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full h-11 px-3.5 mt-1.5 bg-white border border-gray-300 shadow-xs rounded-lg text-gray-600 text-md placeholder:text-gray-500 focus:ring-gray-300 focus:border-gray-300 focus-visible:ring-gray-300 focus-visible:outline-0"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                {/* INPUT */}
                <div className="w-full">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    className="w-full h-11 px-3.5 mt-1.5 bg-white border border-gray-300 shadow-xs rounded-lg text-gray-600 text-md placeholder:text-gray-500 focus:ring-gray-300 focus:border-gray-300 focus-visible:ring-gray-300 focus-visible:outline-0"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              {/* CHECKBOX WITH FORET PASSWORD */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 border border-gray-300 rounded-[4px] bg-white focus:ring-3 focus:ring-blue-300"
                    />
                  </div>
                  <label
                    htmlFor="remember"
                    className=" ml-2 text-sm text-gray-700 font-medium"
                  >
                    Remember me for 30 days
                  </label>
                </div>
                <a
                  href="#abc"
                  className=" text-sm text-primary-700 font-semibold"
                >
                  Forgot password
                </a>
              </div>

              {/* BUTTONS */}
              <div className="space-y-4">
                {/* <Link to="/projects"> */}
                <button
                  className={`w-full h-11 shadow-xs rounded-lg text-md font-semibold text-white
                  ${
                    !isLoading
                      ? "bg-primary-600 hover:bg-primary-700 active:bg-primary-800 hover:transition duration-150 shadow-lg hover:shadow-primary-600/50"
                      : "bg-primary-300"
                  }`}
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      aria-hidden="true"
                      className="w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white inline"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  ) : (
                    "Sign in"
                  )}
                </button>
                {/* </Link> */}

                {/* <button className="w-full h-11 bg-white border border-gray-300 shadow-xs rounded-lg text-md font-semibold text-gray-700 flex items-center justify-center">
                  <img className="mr-3" src={googleIcon} alt="google-icon" />
                  Sign in with Google
                </button> */}
              </div>
            </form>

            {/* SIGNUP BUTTON */}
            <div className="flex items-center justify-center text-sm">
              <span className="text-gray-600 mr-1">Don't have an account?</span>
              <Link to="/signup" className="text-primary-700 font-semibold">
                Sign up
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

export default Login;
