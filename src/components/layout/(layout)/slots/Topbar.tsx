import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Navbar,
  NavbarCenter,
  NavbarEnd,
  NavbarStart,
} from "@app/ui";

// import { SearchButton } from "../components/SearchButton";
import { routes } from "@app/lib/routes";
import { useLayoutContext } from "@app/store/globale/layout";
import { Icon } from "@app/ui/Icon";
import { useNavigate } from "react-router-dom";
import { getDecodedToken } from "@app/store/auth/AuthSelectors";
import { useAppSelector } from "@app/lib/hooks/useStore";
import LocalStorageManager from "@app/localStore/LocalStorageManger";
import { ThemeToggleButton } from "@app/ui/ToggleTheme/ThemeToggleButton";
import { LocalStorageKeys } from "@app/lib/helpers/constants/helpers";
import { useState } from "react";
import { toast } from "sonner";
import { UserService } from "@app/services/actions";
import { ModalHeader } from "@app/ui/Modal";
import { ModalBody } from "@app/ui/Modal";
import { Modal } from "@app/ui/Modal";
import { useMutation } from "@tanstack/react-query";

const Topbar = () => {
  const { hideLeftbar, state } = useLayoutContext();
  const navigate = useNavigate();
  const decodedToken = useAppSelector((state) => getDecodedToken({ state }));

  const [changePasswordModalOpen, setChangePasswordModalOpen] =
    useState<boolean>(false);
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  const openChangePasswordModal = () => setChangePasswordModalOpen(true);
  const closeChangePasswordModal = () => {
    setChangePasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
  };
  const changePasswordMutation = useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      return await UserService.changePassword({ oldPassword, newPassword });
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      closeChangePasswordModal();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
    },
  });

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    changePasswordMutation.mutate({
      oldPassword: currentPassword,
      newPassword,
    });
  };

  const onLogout = async () => {
    localStorage.clear();
    LocalStorageManager.clear();
    navigate(routes.auth.login, { replace: true });
  };
  const resyncPermissions = () => {
    LocalStorageManager.removeItem(LocalStorageKeys.PERMISSIONS);
    window.location.reload();
  };
  return (
    <Navbar className="topbar-wrapper z-10 border-b border-base-200 px-3">
      <NavbarStart className="gap-3">
        <Button
          shape="square"
          color="ghost"
          size="sm"
          aria-label="Leftmenu toggle"
          onClick={() => hideLeftbar(!state.leftbar.hide)}
        >
          <Icon icon="lucide:menu" className="inline-block" fontSize={20} />
        </Button>
        {/* <SearchButton /> */}
      </NavbarStart>
      <NavbarCenter></NavbarCenter>
      <NavbarEnd className="gap-1.5">
        <Button
          onClick={resyncPermissions}
          color="error"
          size="sm"
          shape="circle"
        >
          <Icon icon="lucide:refresh-ccw" fontSize={16} />{" "}
        </Button>
        <ThemeToggleButton shape="circle" color="ghost" size="sm" />

        <Dropdown vertical="bottom" end>
          <DropdownToggle
            className="btn btn-ghost rounded-btn px-1.5 hover:bg-base-content/20"
            button={false}
          >
            <div className="flex items-center gap-2">
              <Icon icon="lucide:user" fontSize={16} />
              <div className="flex flex-col items-start">
                <p className="text-sm/none">{decodedToken?.name}</p>
                {/* <p className="mt-1 text-xs/none text-primary">Edit</p> */}
              </div>
            </div>
          </DropdownToggle>

          <DropdownMenu className="mt-4 w-52">
            <DropdownItem anchor={false}>
              <button
                className="hover:text-primary flex items-center gap-2"
                onClick={openChangePasswordModal}
              >
                <Icon icon="lucide:lock" fontSize={16} />
                Change Password
              </button>
            </DropdownItem>
            <DropdownItem anchor={false}>
              <button className="text-error" onClick={onLogout}>
                <Icon icon="lucide:log-out" fontSize={16} />
                Logout
              </button>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarEnd>
      {/* Change Password Modal */}
      <Modal
        open={changePasswordModalOpen}
        onClose={closeChangePasswordModal}
        role="dialog"
      >
        <form onSubmit={handleChangePassword}>
          <Button
            size="sm"
            shape="circle"
            className="absolute right-2 top-2"
            aria-label="Close modal"
            onClick={closeChangePasswordModal}
          >
            <Icon icon="lucide:x" />
          </Button>
          <ModalHeader className="font-bold">Change Password</ModalHeader>
          <ModalBody>
            <div className="p-4 space-y-4">
              <p className="text-sm text-base-content/70">
                Please enter your current password and the new password you
                would like to use.
              </p>
              <div className="form-control">
                <label className="label" htmlFor="current-password">
                  <span className="label-text">Current Password</span>
                </label>
                <input
                  id="current-password"
                  type="password"
                  className="input input-bordered"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div className="form-control">
                <label className="label" htmlFor="new-password">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  id="new-password"
                  type="password"
                  className="input input-bordered"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>
          </ModalBody>
          <div className="p-4 flex justify-end gap-3 bg-base-200">
            <Button
              type="button"
              onClick={closeChangePasswordModal}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="button"
              color="primary"
              onClick={handleChangePassword}
            >
              Change Password
            </Button>
          </div>
        </form>
      </Modal>
    </Navbar>
  );
};

export { Topbar };
