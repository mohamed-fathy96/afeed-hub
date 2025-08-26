import React, { useState } from "react";
// Styles
import classes from "./Permissions.module.scss";
// MUI
import { Dialog, DialogActions, DialogTitle } from "@mui/material";
import Button from "../Button/Button";
import PermissionsService from "@app/services/actions/permissionService";
import { useToast } from "@app/helpers/hooks/use-toast";

interface RemoveGroupModalProps {
  isRemoveGroupModalOpen: boolean;
  setIsRemoveGroupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchGroupsList: (params: any) => void; // Replace 'any' with the actual type of 'params'
  groupId: string;
  params: any; // Replace 'any' with the actual type of 'params'
}

const RemoveGroupModal: React.FC<RemoveGroupModalProps> = ({
  isRemoveGroupModalOpen,
  setIsRemoveGroupModalOpen,
  fetchGroupsList,
  groupId,
  params,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const handleRemovePage = async () => {
    setIsLoading(true);
    try {
      const res = await PermissionsService.deleteGroupById(groupId);
      setIsLoading(false);
      toast.success(res?.data?.message ?? "Group deleted successfully");
      setIsRemoveGroupModalOpen(false);
      setTimeout(() => {
        fetchGroupsList(params);
      }, 1500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to remove Group");
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: "100%" }}>
      <Dialog
        className={classes.transferBranchModal}
        open={isRemoveGroupModalOpen}
        onClose={() => setIsRemoveGroupModalOpen((prev) => !prev)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{
          paperWidthSm: classes.paperWidthSm,
        }}
      >
        <DialogTitle className={classes.dialogTitle} id="alert-dialog-title">
          Confirm Removing the group
        </DialogTitle>
        <DialogActions className={classes.dialogActions}>
          <Button
            onClick={handleRemovePage}
            disabled={isLoading}
           color="primary"
          >
            Remove
          </Button>
          <Button
            onClick={() => setIsRemoveGroupModalOpen(false)}
            color="secondary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RemoveGroupModal;
