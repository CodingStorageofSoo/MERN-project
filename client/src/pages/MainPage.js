import React from "react";
import UploadForm from "../components/UploadForm";
import ImageList from "../components/ImageList";

const MainPage = () => {
  return (
    <>
      <h2>Couple Album</h2>
      <UploadForm />
      <ImageList />
    </>
  );
};

export default MainPage;
