import React, { useEffect, useRef } from 'react';
import { Box, Button, CircularProgress, IconButton } from '@mui/material';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSendingPhotoMutation } from '../dl/api/oldOrdersApi'
import { TimedAlert } from './TimedAlert';

export const Camera = ({ setShowCamera, numberOrder, setImageSrc }) => {
  const videoRef = useRef(null);
  const [sendingPhoto, {error, isLouding}] = useSendingPhotoMutation();
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
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
  }, []);

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

      try {
        await sendingPhoto({ image: imageSrc, numberOrder }).unwrap();
        setShowCamera(false);
        console.log('Image sent successfully', response);
      } catch (error) {
        console.error('Error sending the image', error);
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'black',
        zIndex: 9999 
      }}
    >
      <Box sx={{ flexGrow: 1, position: 'relative', width: '100%' }}>
        <video
          ref={videoRef}
          autoPlay
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        ></video>
      </Box>
      <IconButton
        onClick={captureImage}
        sx={{
          position: 'absolute',
          bottom: 32,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80px',
          height: '80px',
          bgcolor: 'white',
          color: 'black',
          '&:hover': {
            bgcolor: 'gray',
          },
        }}
      >
        {isLouding ? <CircularProgress size={24} /> : <PhotoCameraIcon sx={{ fontSize: 48 }} />}
      </IconButton>
      <IconButton
        onClick={() => setShowCamera(false)}
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          color: 'white',
        }}
      >
        <ArrowBackIcon sx={{ fontSize: 32 }} />
      </IconButton>
      {error && <TimedAlert  message={error} />}
    </Box>
  );
};