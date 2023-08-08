import React, { useEffect } from "react";
import { Provider } from "react-redux";
import store from "./state/index";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import Landing from "pages/LandingPage";
import Login from "pages/Login";
import Projects from "pages/Projects";
import Signup from "pages/Signup";
import Project from "pages/ProjectPage";
import Verification from "pages/Verification";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivateComponent, PublicComponent } from "components/AccessComponent";

const queryClient = new QueryClient();

const RedirectToHome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/");
  }, [navigate]);

  return null;
};

const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route
              index
              element={
                <PublicComponent>
                  <Landing />
                </PublicComponent>
              }
            />
            <Route
              path="/login"
              element={
                <PublicComponent>
                  <Login />
                </PublicComponent>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicComponent>
                  <Signup />
                </PublicComponent>
              }
            />
            <Route
              path="/verify"
              element={
                <PublicComponent>
                  <Verification />
                </PublicComponent>
              }
            />
            <Route
              path="/projects"
              element={
                <PrivateComponent>
                  <Projects />
                </PrivateComponent>
              }
            />
            <Route
              path="/project/:projectId"
              element={
                <PrivateComponent>
                  <Project />
                </PrivateComponent>
              }
            />
            <Route path="*" element={<>Page not found.</>} />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
