import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import { Routes, Route } from "react-router";

import ToolBar from "./components/ToolBar";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToastContainer />
      <ToolBar />
      <Routes>
        <Route path="/auth/register" element={<RegisterPage />}></Route>
        <Route path="/auth/login" element={<LoginPage />}></Route>
        <Route path="/" element={<MainPage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
