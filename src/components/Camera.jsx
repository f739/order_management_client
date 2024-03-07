import React, { useRef, useState } from 'react';

function Camera() {
  const videoRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');

  const startCamera = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing the camera", error);
      });
  };

  // צילום התמונה
  const captureImage = () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // המרת התמונה מה-canvas ל-URL ושמירתה
      const imageSrc = canvas.toDataURL('image/png');
      setImageSrc(imageSrc);
    }
  };

  // פונקציה להצגת התמונה בחלון חדש
  const openImageInNewTab = () => {
    if (imageSrc) {
      const imageWindow = window.open();
      imageWindow.document.write(`<img src="${imageSrc}" alt="Captured Image"/>`);
    }
  };

  return (
    <div>
      <button onClick={startCamera}>צלם תעודת משלוח</button>
      <video ref={videoRef} autoPlay></video>
      <button onClick={captureImage}>תפוס תמונה</button>
      {imageSrc && <button onClick={openImageInNewTab}>Show Image in New Tab</button>}
    </div>
  );
}

export default Camera;
