import React from "react";
import UploadForm from "../components/UploadForm";
import ImageList from "../components/ImageList";

const MainPage = () => {
  return (
    <div>
      <h2>Album</h2>
      <UploadForm />
      <ImageList />
    </div>
  );
};

export default MainPage;
