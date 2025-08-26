import React, { useState } from "react";
import PermissionsService from "@app/services/actions/permissionService";
import { useToast } from "@app/helpers/hooks/use-toast";
import { InputField } from "../InputField";
import { Button, Card, Drawer } from "@app/ui";
import { Icon } from "@app/ui/Icon";
import xIcon from "@iconify/icons-lucide/x";
interface AddNewPageModalProps {
  isAddNewPageModalOpen: boolean;
  setIsAddNewPageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPagesList: (params: any) => void; // Replace 'any' with the type of 'params'
  selectedPage?: any; // Replace 'any' with the actual type
  setSelectedPage: React.Dispatch<React.SetStateAction<any>>; // Replace 'any' with the actual type
  params: any; // Replace 'any' with the actual type
}

const AddNewPageModal: React.FC<AddNewPageModalProps> = ({
  isAddNewPageModalOpen,
  setIsAddNewPageModalOpen,
  fetchPagesList,
  selectedPage,
  setSelectedPage,
  params,
}) => {
  const toast = useToast();
  const [pageName, setPageName] = useState<string>(selectedPage?.page || "");
  const [permissionKey, setPermissionKey] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAddNewPage = async () => {
    const dataBody = {
      page: pageName,
      permissionKey,
      description,
    };
    setIsLoading(true);
    try {
      const res = await PermissionsService.addNewPermission(dataBody);
      setIsLoading(false);
      toast.success(res?.data?.message ?? "New Page created successfully");
      handleCloseModal();
      setTimeout(() => {
        fetchPagesList(params);
      }, 1500);
    } catch (err: any) {

      toast.error(err?.response?.data?.message ?? "Failed to add new page");
      setIsLoading(false);
    }
  };
  const handleCloseModal = () => {
    setIsAddNewPageModalOpen(false);
    setSelectedPage(null);
  };

  return (
    <Drawer
      open={isAddNewPageModalOpen}
      end
      onClickOverlay={handleCloseModal}
      sideClassName={"z-[100]"}
      side={
        <Card className="rounded-t-lg bg-base-100 h-full border-none overflow-y-auto m-3">
          <div className="bg-[#EDF0FE] p-4">
            <Button
              size="sm"
              type="button"
              shape="circle"
              className="absolute right-2 top-2"
              aria-label="Close Drawer"
              onClick={handleCloseModal}
            >
              <Icon icon={xIcon} />
            </Button>
            {selectedPage ? "Add action" : "Add New Page"}
          </div>
          <div className="space-y-4 p-4">
            {/* Page Name Input */}
            <InputField
              label="Page Name"
              id="page"
              value={pageName}
              onChange={(e) => setPageName(e.target.value)}
              disabled={selectedPage && selectedPage.page}
            />
            {/* Page Key Input */}
            <InputField
              label="Permission Key"
              id="permissionKey"
              value={permissionKey}
              onChange={(e) => setPermissionKey(e.target.value)}
            />
            <InputField
              label="Description"
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mt-6 flex justify-end px-4 gap-2">
            <Button
              color="primary"
              variant="outline"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              loading={isLoading}
              color="primary"
              onClick={handleAddNewPage}
              disabled={isLoading}
            >
              Save
            </Button>
          </div>
        </Card>
      }
    />
  );
};

export default AddNewPageModal;
