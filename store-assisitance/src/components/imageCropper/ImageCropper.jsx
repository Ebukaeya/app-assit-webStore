import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { useState, useEffect, createRef } from "react";

const defaultSrc = "https://raw.githubusercontent.com/roadmanfong/react-cropper/master/example/img/child.jpg";

const ImageCropper = ({
  readImageUrl,
  setCroppedImageUrl,
  setCroppedImageBolb,
  closeModal,
  desiredAspectRatio = 1,
  borderRadius = 0,
  isMultipleImage = false,
}) => {
  const [isCropping, setIsCropping] = useState(false);

  useEffect(() => {
    console.log("isCropping", isCropping);
  }, [isCropping]);

  const cropperRef = createRef(null);

  const grabCroppedImage = () => {
    setIsCropping(true);
    if (typeof cropperRef.current?.cropper !== "undefined") {
      if (isMultipleImage) {
        console.log("multiple image");
        setCroppedImageUrl((prev) => [...prev, cropperRef.current.cropper.getCroppedCanvas().toDataURL()]);
        cropperRef.current.cropper.getCroppedCanvas().toBlob(
          (blob) => {
            setCroppedImageBolb((prev) => [...prev, blob]);
          },
          "image/jpeg",
          1
        );
      } else {
        setCroppedImageUrl(cropperRef.current.cropper.getCroppedCanvas().toDataURL());
        cropperRef.current.cropper.getCroppedCanvas().toBlob(
          (blob) => {
            console.log(blob);
            setCroppedImageBolb(blob);
          },
          "image/jpeg",
          1
        );
      }
      closeModal(false);
      setIsCropping(false);
    }
  };

  const styles = {
    container: {
      position: "fixed",
      top: "0",
      left: "0",
      bottom: "0",
      right: "0",
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.96)",
    },
    buttonDiv: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: "30px",
      gap: "30px",
    },
    btn: {
      width: "150px",
      height: "40px",
      borderRadius: "4px",
      border: "none",
      outline: "none",
      cursor: "pointer",
      color: "white",
      fontSize: "16px",
      fontWeight: "550",
      fontFamily: "Nunito",
      backgroundColor: "#5B79FF",
    },
  };
  const cancelCrop = () => {
    closeModal(false);
  };

  return (
    <>
      <div style={styles.container}>
        <Cropper
          ref={cropperRef}
          style={{ height: "60%", width: "60%" }}
          src={readImageUrl}
          initialAspectRatio={1}
          aspectRatio={desiredAspectRatio}
          borderRadius={borderRadius}
          minCropBoxHeight={10}
          minCropBoxWidth={10}
          responsive={true}
          background={false}
          autoCropArea={1}
        />
        <div style={styles.buttonDiv}>
          <button onClick={cancelCrop} style={{ ...styles.btn, backgroundColor: "red" }}>
            Cancel
          </button>
          {isCropping ? (
            <button style={{ ...styles.btn, cursor: "not-allowed", opacity: "0.7" }}>Cropping...</button>
          ) : (
            <button style={styles.btn} onClick={grabCroppedImage}>
              Crop Image
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default ImageCropper;
