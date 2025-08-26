import React, { useState } from "react";
import { UserService } from "@app/services/actions";
import { AuthService } from "@app/services/actions";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@app/helpers/hooks/use-toast";
import UserForm from "@app/components/form/user/UserForm";
import { PageTitle } from "@app/ui/PageTitle";
import { User } from "@app/lib/types/users";
import RolesGrid from "@app/components/form/user/RolesGrid";
import RestrictedWrapper from "@app/routing/routingComponents/RestrictedWrapper";
import Transactions from "@app/components/form/user/Transactions";
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
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ModalHeader } from "@app/ui/Modal";
import { ModalBody } from "@app/ui/Modal";
import { routes } from "@app/lib/routes";

interface PageProps {}

const EditUserPage: React.FC<PageProps> = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const params: { id?: string } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // Determine the current tab from the URL or default to 'Details'
  const currentTab = searchParams.get("tab") || "Details";

  // Fetch user by id using react-query
  const {
    data: userData,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", params?.id],
    queryFn: async () => {
      const res = await UserService.getUserById(params?.id);
      return res.data;
    },
    enabled: !!params?.id,
  });

  // Fetch user roles using react-query
  const {
    data: roles = [],
    isLoading: isRolesLoading,
    error: rolesError,
  } = useQuery({
    queryKey: ["userRoles", params?.id],
    queryFn: async () => {
      const res = await UserService.getUserRoles(params?.id);
      return res.data;
    },
    enabled: !!params?.id,
  });

  // Fetch user balance using react-query
  const {
    data: userBalance,
    isLoading: isBalanceLoading,
    error: balanceError,
  } = useQuery({
    queryKey: ["userBalance", params?.id],
    queryFn: async () => {
      const res = await UserService.getUserBalance(params?.id);
      return res.data;
    },
    enabled: !!params?.id,
  });

  // Refresh data mutation
  const refreshDataMutation = useMutation({
    mutationFn: async () => {
      // Invalidate and refetch all user-related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["user", params?.id] }),
        queryClient.invalidateQueries({ queryKey: ["userRoles", params?.id] }),
        queryClient.invalidateQueries({
          queryKey: ["userBalance", params?.id],
        }),
      ]);
    },
    onSuccess: () => {
      toast.success("Data refreshed successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to refresh data");
    },
  });

  // Handle errors
  React.useEffect(() => {
    if (userError) {
      toast.error(
        (userError as any)?.response?.data?.message ??
          "Failed to get user details"
      );
    }
  }, [userError, toast]);

  React.useEffect(() => {
    if (rolesError) {
      toast.error(
        (rolesError as any)?.response?.data?.message ??
          "Failed to get user roles"
      );
    }
  }, [rolesError, toast]);

  React.useEffect(() => {
    if (balanceError) {
      toast.error(
        (balanceError as any)?.response?.data?.message ??
          "Failed to get user balance"
      );
    }
  }, [balanceError, toast]);

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

  const handleUserDataRefresh = () => {
    // Specifically refresh user data when user is blocked/unblocked
    queryClient.invalidateQueries({ queryKey: ["user", params?.id] });
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setPassword("");
  };

  const resetPasswordMutation = useMutation({
    mutationFn: async (newPassword: string) => {
      const payload = { newPassword };
      return await UserService.resetPassword(payload, userData?.id);
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

  const handleSubmitResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    resetPasswordMutation.mutate(password);
  };
  const isLoading = isUserLoading || isRolesLoading || isBalanceLoading;

  return (
    <>
      {isLoading || !userData ? (
        <SectionLoader />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          <div className="w-full mb-3 col-span-12">
            <PageTitle
              title={`Edit ${userData?.name} Details` || "Edit User"}
              breadCrumbItems={[
                { label: "Users", active: true, path: routes.dashboard.users.index },
                { label: userData?.name || "", active: true },
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
                    {userData.name || "User"}
                  </h2>
                </div>

                {/* Account Balance */}
                <div className="rounded-box bg-base-content/5 p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Account Balance</span>
                    <div className="flex items-center gap-1">
                      <span
                        className={
                          userBalance?.balance <= 0
                            ? "text-error font-bold"
                            : "text-success font-bold"
                        }
                      >
                        {userBalance?.balance}
                      </span>
                      QR
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:mail" className="text-base-content/70" />
                    <span className="text-sm break-all flex-grow">
                      {userData.email || "No email"}
                    </span>
                    {userData.email && (
                      <Icon
                        icon="lucide:copy"
                        className="text-base-content/60 cursor-pointer hover:text-primary transition-colors"
                        fontSize={18}
                        onClick={() =>
                          copyToClipboard(userData.email, "Email copied!")
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
                      {userData.phoneNumber || "No phone"}
                    </span>
                    {userData.phoneNumber && (
                      <Icon
                        icon="lucide:copy"
                        className="text-base-content/60 cursor-pointer hover:text-primary transition-colors"
                        fontSize={18}
                        onClick={() =>
                          copyToClipboard(
                            userData.phoneNumber,
                            "Phone number copied!"
                          )
                        }
                      />
                    )}
                  </div>
                </div>

                <Divider className="my-4" />

                {/* System Information Section */}
                {userData?.id && (
                  <>
                    <div className="rounded-box bg-base-content/5 p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="lucide:calendar" className="text-primary" />
                        <h3 className="text-sm font-medium">
                          System Information
                        </h3>
                      </div>

                      <div className="space-y-2">
                        {userData?.lastSignInAt && (
                          <div className="flex flex-col">
                            <span className="text-xs text-base-content/70">
                              Last Sign-In
                            </span>
                            <span className="text-sm">
                              {formatToLocalTime(userData?.lastSignInAt)}
                            </span>
                          </div>
                        )}

                        <div className="flex flex-col">
                          <span className="text-xs text-base-content/70">
                            Account Created
                          </span>
                          <span className="text-sm">
                            {formatToLocalTime(userData?.createdAt)}
                          </span>
                        </div>

                        {userData?.smsCodeExpiresAt && (
                          <div className="flex flex-col">
                            <span className="text-xs text-base-content/70">
                              OTP Code Expires
                            </span>
                            <span className="text-sm">
                              {formatToLocalTime(userData?.smsCodeExpiresAt)}
                            </span>
                          </div>
                        )}
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
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-9">
            <Tabs variant="bordered" className="px-4">
              <RadioTab
                name="my_tabs_1"
                label="Details"
                contentClassName="pt-4"
                checked={currentTab === "Details"}
                onChange={() => handleTabChange("Details")}
              >
                {currentTab === "Details" && (
                  <UserForm
                    data={userData}
                    onDataRefresh={handleUserDataRefresh}
                  />
                )}
              </RadioTab>
              <RestrictedWrapper
                action="edit_user_roles"
                requiredPermissions="users"
              >
                <RadioTab
                  name="my_tabs_1"
                  label="Roles"
                  contentClassName="pt-4"
                  checked={currentTab === "Roles"}
                  onChange={() => handleTabChange("Roles")}
                >
                  {currentTab === "Roles" && (
                    <>
                      <RolesGrid
                        roles={roles}
                        userId={Number(params?.id)}
                        fetchRoles={() => {
                          queryClient.invalidateQueries({
                            queryKey: ["userRoles", params?.id],
                          });
                        }}
                      />
                      {/* <CityGrid
                      roles={roles}
                      userId={Number(params?.id)}
                      fetchRoles={fetchUserRoles}
                    /> */}
                    </>
                  )}
                </RadioTab>
              </RestrictedWrapper>
              <RestrictedWrapper
                action="view_user_transactions"
                requiredPermissions="users"
              >
                <RadioTab
                  name="my_tabs_1"
                  label="Transactions"
                  contentClassName="pt-4"
                  checked={currentTab === "Transactions"}
                  onChange={() => handleTabChange("Transactions")}
                >
                  {currentTab === "Transactions" && (
                    <Transactions id={Number(params?.id)} />
                  )}
                </RadioTab>
              </RestrictedWrapper>
            </Tabs>
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
                  className="input input-bordered"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>
          </ModalBody>
          <div className="p-4 flex justify-end gap-3 bg-base-200">
            <Button type="button" onClick={closeModal} variant="outline">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Reset Password
            </Button>
          </div>
        </form>
      </ModalLegacy>
    </>
  );
};

export default EditUserPage;
