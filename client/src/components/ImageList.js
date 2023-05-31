import React, { useContext } from "react";
import { ImageContext } from "../context/ImageContext";

const ImageList = () => {
  const [images] = useContext(ImageContext);

  const imgList = images.map((image) => (
    <img
      key={image.key} // 가상돔을 효율적으로 활용하기 위해서! 인덱스처럼 사용
      style={{ width: "100%" }}
      src={`http://localhost:8080/uploads/${image.key}`}
    />
  ));
  return (
    <div>
      <h3>Image List</h3>
      {imgList}
    </div>
  );
};

export default ImageList;
