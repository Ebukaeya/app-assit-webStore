import "../../styles/uploadImages/uploadImage.css";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ImageCropper from "../../components/imageCropper/ImageCropper";

let imagePlaceHolder = "https://via.placeholder.com/150";
const UploadProductImages = () => {
  const socket = useMemo(() => io(process.env.REACT_APP_Back_end_api_root, { transports: ["websocket"] }), []); /* auth can be provided */

  const storeID = useParams().storeID;

  const [imageUrlStage, setImageUrlStage] = useState(null);
  const [images, setImages] = useState([]); // array of image urls for src
  const [imageBuffer, setImageBuffer] = useState([]); // image buffer for sending to server
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
      socket.emit("createRoom", storeID);
    });
    socket.on("newImagesFromPhone", () => {
      console.log("new images received");
      alert("images received successfully");
      setImageBuffer([]);
      setImages([]);
      setImageUrlStage(null);
      setShowSuccess(true);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleImageUpload = (e) => {
    const image = e.target.files[0];
    console.log(image);
    if (image) {
      console.log("image");
      const reader = new FileReader();
      reader.onload = function (evt) {
        setImageUrlStage(evt.target.result);
        setOpenImageCropper(true);
      };
      reader.readAsDataURL(image);
    } else {
      console.log("Please select an image");
      alert("Please select an image");
    }
  };

  const sendImages = async () => {
    console.log("send images");
    try {
      socket.emit("sendImagesFromPhone", { storeID, imagesBuffer: imageBuffer, imageUrl: images });
    } catch (error) {
      console.log(error);
    }
  };

  /*   const closeWindow = () => {
    /*  socket.disconnect(); */

  /*    window.close();
  }; */

  return (
    <>
      <div className='uploadImag777'>
        <div className='containerDivSep2'>
          {showSuccess ? (
            <div className='imagesSentSucess'>
              <img
                src='https://res.cloudinary.com/ebuka1122/image/upload/v1716276941/ihub-store-images/NoPath_-_Copy_e0glss.png'
                alt='success'
                className='successImage'
              />
              <p>Images sent successfully</p>
              {/*  <button onClick={closeWindow} className='primaryBtn'>
                {" "}
                Close window{" "}
              </button> */}
            </div>
          ) : (
            <>
              <div className='placeholderimage32'>
                <img src={!images.length == 0 ? images[0] : imagePlaceHolder} />
                <img src={images.length > 1 ? images[1] : imagePlaceHolder} />
                <img src={images.length > 2 ? images[2] : imagePlaceHolder} />
                <img src={images.length > 3 ? images[3] : imagePlaceHolder} />
              </div>
              <div className='selectImageDiv'>
                <img src='https://res.cloudinary.com/ebuka1122/image/upload/v1716276006/ihub-store-images/Group_2579_a3pmps.png' />
                <p>Upload images</p>

                <input onChange={(e) => handleImageUpload(e)} type='file' id='fileImage' accept='image/*' />
              </div>
              {images.length > 0 ? (
                <button onClick={sendImages} className='primaryBtn '>
                  Send images
                </button>
              ) : (
                <button className='primaryBtn  primaryBtnDisabled'>Send images</button>
              )}
            </>
          )}
        </div>
      </div>
      {openImageCropper && (
        <ImageCropper
          readImageUrl={imageUrlStage}
          setCroppedImageUrl={setImages}
          setCroppedImageBolb={setImageBuffer}
          closeModal={setOpenImageCropper}
          borderRadius={4}
          isMultipleImage={true}
        />
      )}
    </>
  );
};

export default UploadProductImages;
