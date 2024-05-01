import React, { useEffect, useRef, useState } from 'react';
const URL = import.meta.env.VITE_API_URL;
import $ from 'axios';


export const Camera = ({setShowCamera, numberOrder, setImageSrc}) => {
  const videoRef = useRef(null);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: {facingMode: 'environment'} })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((error) => {
        console.error("Error accessing the camera", error);
      });

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'visible';
    };
  });

  const captureImage = async () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const video = videoRef.current;

    if (video) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageSrc = canvas.toDataURL('image/jpeg', 0.7);
      setImageSrc(imageSrc);

      // שליחת התמונה לשרת
      try {
        const response = await $.post(`${URL}/oldOrders/sendingPhotoOfADeliveryCertificate`, {image: imageSrc, numberOrder });
        setShowCamera(false)
        console.log('Image sent successfully', response);
      } catch (error) {
        console.error('Error sending the image', error);
      }
    }
  };

  return (
    <div className='box-camera'>
      <div className='return' onClick={ () => setShowCamera(false)}> &lt;= </div>
      <video ref={videoRef} autoPlay></video>
      <button onClick={captureImage}>O</button>
    </div>
  );
}
