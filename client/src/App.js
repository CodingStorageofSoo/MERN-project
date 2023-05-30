import React from "react";
import UploadForm from "./components/UploadForm";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer />
      <h2>Couple Album</h2>
      <UploadForm />
    </>
  );
}

export default App;
