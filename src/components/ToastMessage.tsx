import React from 'react';
import { Snackbar, Alert } from '@mui/material';

interface ToastMessageProps {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
  onClose: () => void;
}

const ToastMessage: React.FC<ToastMessageProps> = ({ open, message, severity, onClose }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2000}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      style={{ position: 'fixed', top: '20px', zIndex: 9999 }} // <-- Ensure fixed positioning and high z-index
    >
      <Alert onClose={onClose} severity={severity} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default ToastMessage;
