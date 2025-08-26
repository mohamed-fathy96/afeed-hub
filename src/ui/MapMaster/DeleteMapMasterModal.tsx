import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface DeleteMapMasterModalProps {
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  handleDelete: () => void;
  type: string;
}

const DeleteMapMasterModal: React.FC<DeleteMapMasterModalProps> = ({
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  handleDelete,
  type
}) => {
  return (
    <Dialog
      open={isDeleteModalOpen}
      onClose={() => setIsDeleteModalOpen(false)}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <DeleteOutlineIcon color="error" />
        Delete Confirmation
      </DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this {type}? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMapMasterModal;
