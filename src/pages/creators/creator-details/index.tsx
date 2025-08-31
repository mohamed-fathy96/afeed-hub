import React, { useState } from "react";
import { CreatorService, UserService } from "@app/services/actions";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useToast } from "@app/helpers/hooks/use-toast";
import { PageTitle } from "@app/ui/PageTitle";
import { CreatorDetails } from "@app/lib/types/creators";
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
import CreatorOverview from "../components/Details/CreatorOverview";
import CreatorProduct from "../components/Details/CreatorProduct";
import CreatorCustomers from "../components/Details/CreatorCustomers";

interface PageProps {}

const CreatorDetailsPage: React.FC<PageProps> = () => {
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
  } = useQuery<CreatorDetails>({
    queryKey: ["creator", params?.id],
    queryFn: async () => {
      const res = await CreatorService.getCreatorById(params?.id);
      return res.data?.data;
    },
    enabled: !!params?.id,
  });

  // Refresh data mutation
  const refreshDataMutation = useMutation({
    mutationFn: async () => {
      // Invalidate and refetch all creator-related queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["creator", params?.id] }),
      ]);
    },
    onSuccess: () => {
      toast.success("Data refreshed successfully");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to refresh data");
    },
  });
  const impersonateCreator = useMutation({
    mutationFn: async () => {
      const response = await CreatorService.impersonateCreator(
        userData?.profile?._id
      );
      return response;
    },
    onSuccess: (response: any) => {
      console.log(response);

      toast.success("Impersonated user successfully");
      window.open(
        `http://localhost:3102/en/cc/auth/login?token=${response?.data?.data?.token}`,
        "_blank"
      );
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to impersonate user"
      );
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

  const handleSubmitResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    resetPasswordMutation.mutate(password);
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
                `Edit ${userData?.profile?.full_name} Details` || "Edit Creator"
              }
              breadCrumbItems={[
                {
                  label: "Creators",
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
                    {userData?.profile?.profile_pic ? (
                      <img
                        src={userData.profile.profile_pic}
                        alt={userData.profile.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Icon icon="lucide:user" className="w-16 h-16" />
                    )}
                  </Avatar>
                  <h2 className="text-xl font-semibold text-center">
                    {userData?.profile?.full_name || "Creator"}
                  </h2>
                  <span className="text-sm text-base-content/70 text-center">
                    {userData?.profile?.service || "Creator"}
                  </span>
                </div>{" "}
                {/* Creator Quick Stats */}
                <div className="rounded-box bg-base-content/5 p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Pending Payout</span>
                    <div className="flex items-center gap-1">
                      <span className="text-primary font-bold">
                        {userData?.metrics?.pendingPayoutAmount?.toLocaleString() ||
                          0}
                      </span>
                      <span className="text-xs">KD</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Customers</span>
                    <span className="font-bold">
                      {userData?.metrics?.totalCustomers?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-2">
                    <Icon icon="lucide:mail" className="text-base-content/70" />
                    <span className="text-sm break-all flex-grow">
                      {userData?.profile?.email || "No email"}
                    </span>
                    {userData?.profile?.email && (
                      <Icon
                        icon="lucide:copy"
                        className="text-base-content/60 cursor-pointer hover:text-primary transition-colors"
                        fontSize={18}
                        onClick={() =>
                          copyToClipboard(
                            userData.profile.email,
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
                      {userData?.profile?.phone_number || "No phone"}
                    </span>
                    {userData?.profile?.phone_number && (
                      <Icon
                        icon="lucide:copy"
                        className="text-base-content/60 cursor-pointer hover:text-primary transition-colors"
                        fontSize={18}
                        onClick={() =>
                          copyToClipboard(
                            userData.profile.phone_number,
                            "Phone number copied!"
                          )
                        }
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon
                      icon="lucide:map-pin"
                      className="text-base-content/70"
                    />
                    <span className="text-sm flex-grow">
                      {userData?.profile?.service || "No service"}
                    </span>
                  </div>
                </div>
                <Divider className="my-4" />
                {/* Creator Information Section */}
                {userData?.profile?._id && (
                  <>
                    <div className="rounded-box bg-base-content/5 p-3 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon icon="lucide:star" className="text-primary" />
                        <h3 className="text-sm font-medium">
                          Creator Information
                        </h3>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-col">
                          <span className="text-xs text-base-content/70">
                            Plan Type
                          </span>
                          <span className="text-sm">
                            {userData?.subscription?.planType || "N/A"}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-base-content/70">
                            Total Products
                          </span>
                          <span className="text-sm">
                            {userData?.metrics?.totalProducts || 0}
                          </span>
                        </div>

                        <div className="flex flex-col">
                          <span className="text-xs text-base-content/70">
                            30-Day Revenue
                          </span>
                          <span className="text-sm text-success font-medium">
                            {userData?.metrics?.revenue30d?.toLocaleString() ||
                              0}{" "}
                            KD
                          </span>
                        </div>

                        {userData?.metrics?.lastPayoutDate && (
                          <div className="flex flex-col">
                            <span className="text-xs text-base-content/70">
                              Last Payout
                            </span>
                            <span className="text-sm">
                              {formatToLocalTime(
                                userData.metrics.lastPayoutDate
                              )}
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
                  <Button
                    color="secondary"
                    size="sm"
                    className="w-full flex items-center justify-center gap-1"
                    onClick={openModal}
                  >
                    <Icon icon="lucide:lock" />
                    Reset Password
                  </Button>
                  <Button
                    color="success"
                    size="sm"
                    className="w-full flex items-center justify-center gap-1"
                    onClick={() => impersonateCreator.mutate()}
                  >
                    <Icon icon="lucide:eye" />
                    Impersonate
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="lg:col-span-9">
            <Tabs variant="tabs-box" className="px-4">
              <RadioTab
                name="my_tabs_1"
                label="Details"
                checked={currentTab === "Details"}
                onChange={() => handleTabChange("Details")}
              ></RadioTab>

              <RadioTab
                name="my_tabs_1"
                label="Products"
                checked={currentTab === "Products"}
                onChange={() => handleTabChange("Products")}
              ></RadioTab>

              <RadioTab
                name="my_tabs_1"
                label="Customers"
                checked={currentTab === "Customers"}
                onChange={() => handleTabChange("Customers")}
              ></RadioTab>
            </Tabs>
            {currentTab === "Details" && <CreatorOverview creator={userData} />}
            {currentTab === "Products" && userData?.profile?._id && (
              <CreatorProduct creatorId={userData.profile._id} />
            )}
            {currentTab === "Customers" && userData?.profile?._id && (
              <CreatorCustomers creatorId={userData.profile._id} />
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

export default CreatorDetailsPage;
