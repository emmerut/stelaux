import React, { useState } from 'react';
import {
  Modal,
  Fade,
  Backdrop,
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import Lottie from 'react-lottie';
import animationData from '@/assets/animations/alert.json'; // Reemplaza con la ruta de tu archivo JSON de Lottie

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, signalParent }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      // Maneja el error, por ejemplo, muestra un mensaje de error
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={isOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90%', // Make width responsive (90% of viewport)
          maxWidth: 500, // Maximum width on larger screens
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 8, // Added border-radius
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Lottie
              options={defaultOptions}
              height={100}
              width={100}
            />
            <Typography
              id="transition-modal-title"
              variant="h6"
              component="h2"
              style={{ textAlign: 'center' }} // Center the title
            >
              ¡Estas seguro?
            </Typography>

            <Typography id="transition-modal-description" sx={{ mt: 4 }} style={{ textAlign: 'center' }}>
              {signalParent ? (
                "Si eliminas este objeto, eliminaras todas sus variantes asociadas."
              ) : (
                "Eliminaras todos los items seleccionados."
              )}
            </Typography>
          </div>

          <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="error" onClick={handleClose}  sx={{ mr: 4 }}>
              Cancelar
            </Button>
            <Button variant="contained" sx={{'& .MuiButton-label': { color: 'text-indigo-900' } }} onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} /> : 'Aceptar'}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DeleteConfirmationModal;