import React, { useState } from "react";
// Styles
// MUI
import { InputField } from "../InputField";
import PermissionsService from "@app/services/actions/permissionService";
import { useToast } from "@app/helpers/hooks/use-toast";
import { Button, Card, Drawer } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import xIcon from "@iconify/icons-lucide/x";
// MUI components from '@mui/material'
// API

interface AddNewGroupModalProps {
  isAddNewGroupModalOpen: boolean;
  setIsAddNewGroupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchGroupsList: (params: any) => void; // Replace 'any' with the type of 'params'
  params: any; // Replace 'any' with the actual type
}

const AddNewGroupModal: React.FC<AddNewGroupModalProps> = ({
  isAddNewGroupModalOpen,
  setIsAddNewGroupModalOpen,
  fetchGroupsList,
  params,
}) => {
  const toast = useToast();
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNewGroup = async () => {
    const dataBody = {
      groupName,
    };
    setIsLoading(true);
    try {
      const res = await PermissionsService.addNewGroup(dataBody);
      setIsLoading(false);
      toast.success(res?.data?.message ?? "New Group created successfully");
      setIsAddNewGroupModalOpen(false);
      setTimeout(() => {
        fetchGroupsList(params);
      }, 1500);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to add new group");
      setIsLoading(false);
    }
  };

  return (
    <Drawer
      open={isAddNewGroupModalOpen}
      end
      onClickOverlay={() => setIsAddNewGroupModalOpen((prev) => !prev)}
      sideClassName={"z-[100]"}
      side={
        <Card className="rounded-t-lg bg-base-100 h-full border-none overflow-y-auto w-[400px] m-3">
          <div className="bg-[#EDF0FE] p-4">
            <Button
              size="sm"
              type="button"
              shape="circle"
              className="absolute right-2 top-2"
              aria-label="Close Drawer"
              onClick={() => setIsAddNewGroupModalOpen((prev) => !prev)}
            >
              <Icon icon={xIcon} />
            </Button>
            Add New Group
          </div>
          <div className="p-4 space-y-4">
            <InputField
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              id="outlined-basic"
              label={"Group Name"}
            />
            <Button onClick={handleAddNewGroup} disabled={isLoading}>
              Save
            </Button>
          </div>
        </Card>
      }
    />
  );
};

export default AddNewGroupModal;
