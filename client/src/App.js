import React from "react";
import UploadForm from "./components/UploadForm";
import ImageList from "./components/ImageList";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <ToastContainer />
      <h2>Album</h2>
      <UploadForm />
      <ImageList />
    </div>
  );
};

export default App;
