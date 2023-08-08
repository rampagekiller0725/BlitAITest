import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    identityPoolId: "us-east-1:02b9e222-2dab-4f53-933a-e4c13fc7ffe8",
    userPoolId: "us-east-1_p6bu9madW",
    userPoolWebClientId: "u2v6gnankavtskm9g7qu0jc5d",
    region: "us-east-1",
  },
  Storage: {
    AWSS3: {
      bucket: "blitai-dev-bucket",
      region: "us-east-1",
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
