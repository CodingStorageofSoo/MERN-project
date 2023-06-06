import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import "./UploadForm.css";
import { toast } from "react-toastify";
import ProgressBar from "./ProgressBar";
import { ImageContext } from "../context/ImageContext";

const UploadForm = () => {
  const { setImages, setMyImages } = useContext(ImageContext);
  const [imageFiles, setImageFiles] = useState(null);

  const [previews, setPreviews] = useState([]);

  const [percent, setPercent] = useState(0);
  const [isPublic, setIsPublic] = useState(true);

  const inputRef = useRef();

  const imageSelectHandler = async (event) => {
    const imageFileInfo = event.target.files;
    setImageFiles(imageFileInfo);

    const imagePreviews = await Promise.all(
      [...imageFileInfo].map(async (imgFile) => {
        return new Promise((resolve, reject) => {
          try {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imgFile);
            fileReader.onload = (e) =>
              resolve({ imgSrc: e.target.result, fileName: imgFile.name });
          } catch (err) {
            reject(err);
          }
        });
      })
    );
    setPreviews(imagePreviews);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (let imageFile of imageFiles) {
      formData.append("imageTest", imageFile);
    }
    formData.append("public", isPublic);

    try {
      const res = await axios.post("/images", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setPercent(Math.round((100 * e.loaded) / e.total));
        },
      });

      if (isPublic) setImages((prevData) => [...res.data, ...prevData]);
      setMyImages((prevData) => [...res.data, ...prevData]);

      toast.success("success!");

      setTimeout(() => {
        setPercent(0);
        setPreviews([]);
        inputRef.current.value = null;
      }, 3000);
    } catch (err) {
      toast.error(err.response.data.message);
      setPercent(0);
      setPreviews([]);
      console.error(err);
      inputRef.current.value = null;
    }
  };

  const previewImages = previews.map((preview, index) => (
    <img
      key={index}
      style={{ width: 200, height: 200, objectFit: "cover" }}
      src={preview.imgSrc}
      alt=""
      className={`image-preview ${preview.imgSrc && "image-preview-show"}`}
    />
  ));

  const fileName =
    previews.length === 0
      ? "Please upload image file"
      : previews.reduce(
          (previous, current) => previous + `${current.fileName},`,
          ""
        );

  return (
    <>
      <form onSubmit={onSubmit}>
        <div style={{ display: "flex", flexWrap: "wrap" }}>{previewImages}</div>
        <ProgressBar percent={percent} />
        <div className="file-dropper">
          {fileName}
          <input
            ref={(ref) => {
              inputRef.current = ref;
            }}
            id="image"
            type="file"
            multiple={true}
            accept="image/*"
            onChange={imageSelectHandler}
          />
        </div>
        <input
          type="checkbox"
          id="public-check"
          value={!isPublic}
          onChange={() => setIsPublic(!isPublic)}
        />
        <label htmlFor="public-check">비공개</label>
        <button
          type="submit"
          style={{
            width: "100%",
            height: 40,
            borderRadius: 3,
            cursor: "pointer",
          }}
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default UploadForm;
