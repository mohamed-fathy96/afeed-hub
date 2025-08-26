import React, { useState } from "react";
// Styles
import classes from "./Permissions.module.scss";
// MUI
import { Dialog, DialogActions, DialogTitle } from "@material-ui/core";
import Button from "../Button/Button";
import PermissionsService from "@app/services/actions/permissionService";
import { useToast } from "@app/helpers/hooks/use-toast";
// API

interface RemovePageModalProps {
  isRemovePageModalOpen: boolean;
  setIsRemovePageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPagesList: (params: any) => void; // Replace 'any' with the actual type of 'params'
  pageId: string;
  params: any; // Replace 'any' with the actual type of 'params'
}

const RemovePageModal: React.FC<RemovePageModalProps> = ({
  isRemovePageModalOpen,
  setIsRemovePageModalOpen,
  fetchPagesList,
  pageId,
  params,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const handleRemovePage = async () => {
    setIsLoading(true);
    try {
      const res = await PermissionsService.deletePageById(pageId);
      setIsLoading(false);
      toast.success(res?.data?.message ?? "Page deleted successfully");
      setIsRemovePageModalOpen(false);
      setTimeout(() => {
        fetchPagesList(params);
      }, 1500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to remove page");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Dialog
        className={classes.transferBranchModal}
        open={isRemovePageModalOpen}
        onClose={() => setIsRemovePageModalOpen((prev) => !prev)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{
          paperWidthSm: classes.paperWidthSm,
        }}
      >
        <DialogTitle className={classes.dialogTitle} id="alert-dialog-title">
          Confirm Removing the page
        </DialogTitle>
        <DialogActions className={classes.dialogActions}>
          <Button
            color="error"
            onClick={handleRemovePage}
            disabled={isLoading}
          >
            Remove
          </Button>
          <Button
            color="secondary"
            onClick={() => setIsRemovePageModalOpen(false)}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RemovePageModal;
