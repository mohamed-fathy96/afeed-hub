import React, { useState } from "react";
import { UserService } from "@app/services/actions";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@app/helpers/hooks/use-toast";
import { PageTitle } from "@app/ui/PageTitle";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  Divider,
  RadioTab,
  Tabs,
  ModalLegacy,
} from "@app/ui";
import { Icon } from "@app/ui/Icon";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ModalHeader } from "@app/ui/Modal";
import { ModalBody } from "@app/ui/Modal";
import { routes } from "@app/lib/routes";
import UserPurchases from "../components/Details/UserPurchases";
import { UserDetails } from "@app/lib/types/users";

interface PageProps {}

const EditUserPage: React.FC<PageProps> = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const params: { id?: string } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // Determine the current tab from the URL or default to 'Details'
  const currentTab = searchParams.get("tab") || "Purchases";

  // Fetch user by id using react-query
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery<UserDetails>({
    queryKey: ["user", params?.id],
    queryFn: async () => {
      const res = await UserService.getUserById(params?.id);
      return res.data?.data;
    },
    enabled: !!params?.id,
  });

  // Refresh data mutation
  const refreshDataMutation = useMutation({
    mutationFn: async () => {
      // Invalidate and refetch all user-related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["user", params?.id] }),
      ]);
    },
    onSuccess: () => {
      toast.success("Data refreshed successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to refresh data");
    },
  });

  // Handle tab changes and update URL
  const handleTabChange = (tabName: string) => {
    navigate(`?tab=${tabName}`, { replace: true });
  };

  const copyToClipboard = (text: string, label: string = "Copied!") => {
    navigator.clipboard.writeText(text);
    toast.success(label);
  };

  const handleRefreshData = () => {
    refreshDataMutation.mutate();
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setPassword("");
  };

  const resetPasswordMutation = useMutation({
    mutationFn: async (newPassword: string) => {
      const payload = { newPassword };
      return await UserService.resetPassword(payload, userData?.profile?._id);
    },
    onSuccess: () => {
      toast.success("Password reset successfully");
      setPassword("");
      closeModal();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to reset password");
    },
  });

  // Block/Unblock user mutation
  const blockUserMutation = useMutation({
    mutationFn: async (blocked: boolean) => {
      return await UserService.blockUser(blocked, params?.id);
    },
    onSuccess: (_, blocked) => {
      queryClient.invalidateQueries({ queryKey: ["user", params?.id] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(`User ${blocked ? "blocked" : "unblocked"} successfully`);
      setBlockModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          `Failed to ${
            userData?.profile?.status === "B" ? "unblock" : "block"
          } user`
      );
    },
  });

  const handleSubmitResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    resetPasswordMutation.mutate(password);
  };

  const openBlockModal = () => setBlockModalOpen(true);
  const closeBlockModal = () => setBlockModalOpen(false);

  const handleBlockUser = () => {
    const isCurrentlyBlocked = userData?.profile?.status === "B";
    blockUserMutation.mutate(!isCurrentlyBlocked);
  };

  const isLoading = isUserLoading;

  return (
    <>
      {isLoading || !userData ? (
        <SectionLoader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="w-full mb-3 col-span-12">
            <PageTitle
              title={
                `Edit ${userData?.profile?.full_name || "User"} Details` ||
                "Edit User"
              }
              breadCrumbItems={[
                {
                  label: "Users",
                  active: true,
                  path: routes.dashboard.users.index,
                },
                { label: userData?.profile?.full_name || "", active: true },
              ]}
            />
          </div>
          {/* User Quick Info Card */}
          <div className="lg:col-span-3">
            <Card className="bg-base-100">
              <CardBody>
                <div className="flex flex-col items-center justify-center mb-4">
                  <Avatar shape="circle" size="lg" className="mb-4">
                    <Icon icon="lucide:user" className="w-16 h-16" />
                  </Avatar>
                  <h2 className="text-xl font-semibold text-center">
                    {userData.profile?.full_name || "User"}
                  </h2>

                  {/* User Status Badge */}
                  <div
                    className={`badge gap-1 mt-2 ${
                      userData.profile?.status === "B"
                        ? "badge-error"
                        : userData.profile?.status === "A"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    <Icon
                      icon={
                        userData.profile?.status === "B"
                          ? "lucide:ban"
                          : userData.profile?.status === "A"
                          ? "lucide:check-circle"
                          : "lucide:alert-circle"
                      }
                      className="w-3 h-3"
                    />
                    {userData.profile?.status === "B"
                      ? "Blocked"
                      : userData.profile?.status === "A"
                      ? "Active"
                      : userData.profile?.status === "I"
                      ? "Inactive"
                      : "Deleted"}
                  </div>
                </div>

                {/* Account Balance */}

                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:mail" className="text-base-content/70" />
                    <span className="text-sm break-all flex-grow">
                      {userData.profile?.email || "No email"}
                    </span>
                    {userData.profile?.email && (
                      <Icon
                        icon="lucide:copy"
                        className="text-base-content/60 cursor-pointer hover:text-primary transition-colors"
                        fontSize={18}
                        onClick={() =>
                          copyToClipboard(
                            userData.profile?.email,
                            "Email copied!"
                          )
                        }
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="lucide:phone"
                      className="text-base-content/70"
                    />
                    <span className="text-sm flex-grow">
                      {userData.profile?.phone_number || "No phone"}
                    </span>
                    {userData.profile?.phone_number && (
                      <Icon
                        icon="lucide:copy"
                        className="text-base-content/60 cursor-pointer hover:text-primary transition-colors"
                        fontSize={18}
                        onClick={() =>
                          copyToClipboard(
                            userData.profile?.phone_number,
                            "Phone number copied!"
                          )
                        }
                      />
                    )}
                  </div>
                </div>

                {/* User Statistics */}
                <div className="rounded-box bg-base-content/5 p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="lucide:trending-up" className="text-primary" />
                    <h3 className="text-sm font-medium">Statistics</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">
                        {userData?.purchases?.total || 0}
                      </div>
                      <div className="text-xs text-base-content/70">
                        Purchases
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-secondary">
                        {userData?.purchases?.items?.length || 0}
                      </div>
                      <div className="text-xs text-base-content/70">
                        Items Bought
                      </div>
                    </div>
                  </div>
                </div>

                <Divider className="my-4" />

                {/* System Information Section */}
                {userData?.profile?._id && (
                  <>
                    <div className="rounded-box bg-base-content/5 p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="lucide:calendar" className="text-primary" />
                        <h3 className="text-sm font-medium">
                          System Information
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-base-content/70">
                            User ID
                          </span>
                          <span className="text-sm font-mono">
                            {userData.profile._id}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-base-content/70">
                            Service
                          </span>
                          <span className="text-sm">
                            {userData.profile.service || "N/A"}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-base-content/70">
                            Status
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              userData.profile.status === "A"
                                ? "text-success"
                                : "text-error"
                            }`}
                          >
                            {userData.profile.status === "A"
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="flex flex-col gap-3">
                  <Button
                    color="primary"
                    size="sm"
                    className="w-full"
                    onClick={handleRefreshData}
                    loading={refreshDataMutation.isPending}
                    disabled={refreshDataMutation.isPending}
                  >
                    {"Refresh Data"}
                  </Button>
                  {/* <RestrictedWrapper
                    requiredPermissions="users"
                    action="reset_password"
                  > */}
                  <Button
                    color="secondary"
                    size="sm"
                    className="w-full flex items-center justify-center gap-1"
                    onClick={openModal}
                  >
                    <Icon icon="lucide:lock" />
                    Reset Password
                  </Button>
                  {/* </RestrictedWrapper> */}
                  <Button
                    color={
                      userData?.profile?.status === "B" ? "success" : "error"
                    }
                    size="sm"
                    className="w-full flex items-center justify-center gap-1"
                    onClick={openBlockModal}
                    loading={blockUserMutation.isPending}
                    disabled={blockUserMutation.isPending}
                  >
                    <Icon
                      icon={
                        userData?.profile?.status === "B"
                          ? "lucide:unlock"
                          : "lucide:ban"
                      }
                    />
                    {userData?.profile?.status === "B"
                      ? "Unblock User"
                      : "Block User"}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-9">
            <Tabs variant="tabs-box" className="px-4">
              <RadioTab
                name="my_tabs_1"
                label="Purchases"
                contentClassName="pt-4"
                checked={currentTab === "Purchases"}
                onChange={() => handleTabChange("Purchases")}
              ></RadioTab>
            </Tabs>
            {currentTab === "Purchases" && userData?.purchases && (
              <UserPurchases purchases={userData.purchases} />
            )}
          </div>
        </div>
      )}
      {/* Password Reset Modal */}
      <ModalLegacy open={modalOpen} onClickBackdrop={closeModal} role="dialog">
        <form onSubmit={handleSubmitResetPassword}>
          <Button
            size="sm"
            shape="circle"
            className="absolute right-2 top-2"
            aria-label="Close modal"
            onClick={closeModal}
          >
            <Icon icon="lucide:x" />
          </Button>
          <ModalHeader className="font-bold">Reset Password</ModalHeader>
          <ModalBody>
            <div className="p-4 space-y-4">
              <p className="text-sm text-base-content/70">
                Enter a new password for this user. The user will need to use
                this password for their next login.
              </p>
              <div className="form-control">
                <label className="label" htmlFor="new-password">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  id="new-password"
                  type="password"
                  className={`input input-bordered ${
                    password.length > 0 && password.length < 6
                      ? "input-error"
                      : ""
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  required
                  minLength={6}
                />
                {password.length > 0 && password.length < 6 && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      Password must be at least 6 characters
                    </span>
                  </label>
                )}
              </div>
            </div>
          </ModalBody>
          <div className="p-4 flex justify-end gap-3 bg-base-200">
            <Button type="button" onClick={closeModal} variant="outline">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              loading={resetPasswordMutation.isPending}
              disabled={resetPasswordMutation.isPending || password.length < 6}
            >
              Reset Password
            </Button>
          </div>
        </form>
      </ModalLegacy>

      {/* Block User Confirmation Modal */}
      <ModalLegacy
        open={blockModalOpen}
        onClickBackdrop={closeBlockModal}
        role="dialog"
      >
        <Button
          size="sm"
          shape="circle"
          className="absolute right-2 top-2"
          aria-label="Close modal"
          onClick={closeBlockModal}
        >
          <Icon icon="lucide:x" />
        </Button>
        <ModalHeader>
          <h3 className="text-lg font-bold">
            {userData?.profile?.status === "B" ? "Unblock User" : "Block User"}
          </h3>
        </ModalHeader>
        <ModalBody>
          <div className="py-4">
            <div className="flex items-center gap-3 mb-4">
              <Icon
                icon={
                  userData?.profile?.status === "B"
                    ? "lucide:unlock"
                    : "lucide:ban"
                }
                className={`w-12 h-12 ${
                  userData?.profile?.status === "B"
                    ? "text-success"
                    : "text-error"
                }`}
              />
              <div>
                <h4 className="text-lg font-semibold">
                  {userData?.profile?.status === "B" ? "Unblock" : "Block"}{" "}
                  {userData?.profile?.full_name}?
                </h4>
                <p className="text-base-content/70">
                  {userData?.profile?.status === "B"
                    ? "This user will be able to access their account again."
                    : "This user will no longer be able to access their account."}
                </p>
              </div>
            </div>

            <div className="bg-base-200 p-3 rounded-lg">
              <p className="text-sm">
                <strong>User:</strong> {userData?.profile?.full_name} (
                {userData?.profile?.email})
              </p>
              <p className="text-sm">
                <strong>Current Status:</strong>
                <span
                  className={`ml-1 font-medium ${
                    userData?.profile?.status === "B"
                      ? "text-error"
                      : "text-success"
                  }`}
                >
                  {userData?.profile?.status === "B" ? "Blocked" : "Active"}
                </span>
              </p>
            </div>
          </div>
        </ModalBody>
        <div className="p-4 flex justify-end gap-3 bg-base-200">
          <Button type="button" onClick={closeBlockModal} variant="outline">
            Cancel
          </Button>
          <Button
            color={userData?.profile?.status === "B" ? "success" : "error"}
            loading={blockUserMutation.isPending}
            disabled={blockUserMutation.isPending}
            onClick={handleBlockUser}
          >
            {userData?.profile?.status === "B" ? "Unblock User" : "Block User"}
          </Button>
        </div>
      </ModalLegacy>
    </>
  );
};

export default EditUserPage;
