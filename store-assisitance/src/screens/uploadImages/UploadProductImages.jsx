import "../../styles/uploadImages/uploadImage.css";
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import ImageCropper from "../../components/imageCropper/ImageCropper";
import imageCompression from "browser-image-compression";

let imagePlaceHolder = "https://via.placeholder.com/150";

const UploadProductImages = () => {
  const storeID = useParams().storeID;
  const socket = useMemo(
    () =>
      io(process.env.REACT_APP_Back_end_api_root, {
        transports: ["websocket"],
        reconnection: true, // Enable automatic reconnection
        reconnectionAttempts: Infinity, // Number of reconnection attempts (-1 for infinite)
        reconnectionDelay: 1000, // Initial delay before attempting reconnection (milliseconds)
        reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts (milliseconds)
        timeout: 20000, // Connection timeout (milliseconds)
      }),
    []
  ); /* auth can be provided */

  const [imageUrlStage, setImageUrlStage] = useState(null);
  const [images, setImages] = useState([]); // array of image urls for src
  const [imageBuffer, setImageBuffer] = useState([]); // image buffer for sending to server
  const [openImageCropper, setOpenImageCropper] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    socket.on("connect", () => {
      // x8WIv7-mJelg7on_ALbx
      socket.emit("createRoom", storeID);
    });
    socket.on("newImagesFromPhone", () => {
      setIsLoading(false);
      console.log("new images received");
      alert("images received successfully");
      setImageBuffer([]);
      setImages([]);
      setImageUrlStage(null);
      setShowSuccess(true);
    });

    return () => {};
  }, []);

  const handleImageUpload = async (e) => {
    if (images.length >= 4) {
      alert("You can only upload 4 images");
      return;
    }

    const image = e.target.files[0];
    console.log("image size", image.size);
    if (image.size > 1000000) {
      /* compress */
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      let compressedImage = await imageCompression(image, options);

      console.log("compressedImage", compressedImage.size);

      const reader = new FileReader();
      reader.onload = function (evt) {
        setImageUrlStage(evt.target.result);
        setOpenImageCropper(true);
      };
      reader.readAsDataURL(compressedImage);
      return;
    } else {
      if (image) {
        console.log("image is less than 1mb");
        const reader = new FileReader();
        reader.onload = function (evt) {
          setImageUrlStage(evt.target.result);
          setOpenImageCropper(true);
        };
        reader.readAsDataURL(image);
      } else {
        alert("Please select an image");
      }
    }
  };

  const compressPayLoadBeforeSending = async (imageBlob) => {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    let compressedImageBuffersPre = imageBlob.map(async (image) => {
      let compressedImage = await imageCompression(image, options);
      return compressedImage;
    });
    let compressedImageBuffers = await Promise.all(compressedImageBuffersPre);

    return compressedImageBuffers;
  };

  const sendImages = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    /* further compress before sending */
    let compressedImageBuffers = await compressPayLoadBeforeSending(imageBuffer);

    try {
      socket.emit("sendImagesFromPhone", { storeID, imagesBuffer: compressedImageBuffers /* imageUrl: images */ });
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

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
                <img src={!images.length == 0 ? images[0] : imagePlaceHolder} alt='productImage' />
                <img src={images.length > 1 ? images[1] : imagePlaceHolder} alt='productImage' />
                <img src={images.length > 2 ? images[2] : imagePlaceHolder} alt='productImage' />
                <img src={images.length > 3 ? images[3] : imagePlaceHolder} alt='productImage' />
              </div>
              <div className='selectImageDiv'>
                <img src='https://res.cloudinary.com/ebuka1122/image/upload/v1716276006/ihub-store-images/Group_2579_a3pmps.png' alt='productImage' />
                <p>Upload images</p>

                <input onChange={(e) => handleImageUpload(e)} type='file' id='fileImage' accept='image/*' />
              </div>
              {images.length > 0 ? (
                isLoading ? (
                  <button className='primaryBtn primaryBtnDisabled'>Sending images...</button>
                ) : (
                  <button onClick={(e) => sendImages(e)} className='primaryBtn '>
                    Send images
                  </button>
                )
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
