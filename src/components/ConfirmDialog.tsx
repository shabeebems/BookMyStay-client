import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          width: '100%',
          maxWidth: '400px',
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 2, marginTop: 2 }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          color="primary"
          sx={{ paddingX: 3, paddingY: 1, borderRadius: '12px' }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          sx={{ paddingX: 3, paddingY: 1, borderRadius: '12px' }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
