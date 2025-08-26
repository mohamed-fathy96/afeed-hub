import React, { useEffect } from "react";
import { useToast } from "@app/helpers/hooks/use-toast";
import { GlobalService, UserService } from "@app/services/actions";
import {
  Badge,
  Button,
  Card,
  CardBody,
  ModalActions,
  ModalBody,
  ModalHeader,
  ModalLegacy,
} from "@app/ui";
import { Icon } from "@app/ui/Icon";
import xIcon from "@iconify/icons-lucide/x";
import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";
import { SectionLoader } from "@app/ui/SectionLoader";
import { twMerge } from "tailwind-merge";
import useRolesReducer from "./use-roles-reducer";
import { PageTitle } from "@app/ui/PageTitle";

interface Role {
  id: number;
  group: string;
  roleableId?: number;
  store: {
    id: number;
    title: string;
  };
}

interface Props {
  roles: Role[];
  userId: number;
  fetchRoles: () => void;
}

const RolesGrid: React.FC<Props> = ({ roles, userId, fetchRoles }) => {
  const { state, dispatch } = useRolesReducer();
  const toast = useToast();

  const formatFetchedStores = (stores: any[]) => {
    return stores.map((store) => {
      const storeRoles = roles.filter((role) => role?.roleableId === store.id);
      return {
        ...store,
        roles: storeRoles,
        isAssigned: storeRoles.length > 0,
      };
    });
  };

  const fetchData = async () => {
    dispatch({ type: "SET_IS_LOADER_OPEN", payload: true });
    try {
      const [groupsResponse, storesResponse] = await Promise.all([
        GlobalService.getAllGroups(),
        GlobalService.getAllStores(),
      ]);
      dispatch({ type: "SET_GROUPS", payload: groupsResponse.data });
      dispatch({ type: "SET_STORES_LIST", payload: storesResponse.data });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch data");
    } finally {
      dispatch({ type: "SET_IS_LOADER_OPEN", payload: false });
    }
  };

  const handleAssignPermission = async () => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    if (!state.selectedGroupId) {
      toast.error("Please select a group");
      dispatch({ type: "SET_IS_LOADING", payload: false });
      return;
    }
    const data = {
      groupId: state.selectedGroupId,
      storeIds: [state.selectedStore?.id],
    };
    try {
      const res = await UserService.assignGroupToStore(data, userId);
      if (res) {
        toast.success(res?.data?.message ?? "Group assigned successfully");
        dispatch({ type: "SET_OPEN_MODAL", payload: false });
        dispatch({ type: "SET_SELECTED_STORE", payload: null });
        fetchData();
        fetchRoles();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to assign group");
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  };

  const handleOpenModal = (store: any) => {
    dispatch({ type: "SET_SELECTED_STORE", payload: store });
    dispatch({ type: "SET_OPEN_MODAL", payload: true });
  };
  const handleRemoveRole = async (roleId: number) => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    try {
      const res = await UserService.removeRole(userId, roleId);
      if (res) {
        toast.success(res?.data?.message ?? "Role removed successfully");
        fetchData();
        fetchRoles();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to remove role");
    } finally {
      dispatch({ type: "SET_IS_LOADING", payload: false });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.isLoaderOpen) {
    return <SectionLoader />;
  }

  return (
    <>
      <Card className="space-y-6">
        <CardBody className="bg-base-100">
          <PageTitle title="Assign User to Store" />

          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <p className="text-base-content !text-md font-bold"> Assinged:</p>
              <Badge color="primary" className="rounded-none shadow-md"></Badge>
            </div>
            <div className="flex gap-2">
              <p className="text-base-content !text-md font-bold">
                {" "}
                Not Assigned:
              </p>
              <Badge color="ghost" className="rounded-none shadow-md"></Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formatFetchedStores(state.storesList).map((store) => (
              <CardBody
                key={store.id}
                className={twMerge(
                  "rounded-lg p-6 bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200 hover:cursor-pointer",
                  store.isAssigned
                    ? "border-2 border-primary"
                    : "border border-base-200"
                )}
                onClick={() => handleOpenModal(store)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-base-content">
                    Store: {store.title}
                  </h3>
                  <span className="text-sm text-base-content">#{store.id}</span>
                </div>

                <div className="text-sm text-base-content flex flex-col gap-2">
                  <p className="font-medium">Assigned Roles:</p>
                  {store?.roles?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {store?.roles?.map((role: any) => (
                        <Badge key={role.id} color="primary">
                          {role.group}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p>No roles assigned</p>
                  )}
                </div>
              </CardBody>
            ))}
          </div>
        </CardBody>
        <ModalLegacy
          onClickBackdrop={() => {
            dispatch({ type: "SET_OPEN_MODAL", payload: false });
            dispatch({ type: "SET_SELECTED_STORE", payload: null });
            dispatch({ type: "SET_SELECTED_GROUP_ID", payload: null });
          }}
          open={state.openModal}
          role="dialog"
        >
          <ModalHeader className="font-bold">
            {state.selectedStore?.title} Store #{state.selectedStore?.id}
            <form method="dialog">
              <Button
                size="sm"
                shape="circle"
                className="absolute right-2 top-2"
                aria-label="Close modal"
                onClick={() => {
                  dispatch({ type: "SET_OPEN_MODAL", payload: false });
                  dispatch({ type: "SET_SELECTED_STORE", payload: null });
                  dispatch({ type: "SET_SELECTED_GROUP_ID", payload: null });
                }}
              >
                <Icon icon={xIcon} />
              </Button>
            </form>
          </ModalHeader>
          <ModalBody>
            <SingleSelectDropdown
              options={state.groups}
              optionValue="id"
              optionName="roleGroupName"
              placeholder="Select a group"
              selectedValue={state.selectedGroupId}
              handleChange={(_e, value) =>
                dispatch({ type: "SET_SELECTED_GROUP_ID", payload: value?.id })
              }
            />
            <div className="mt-4">
              {state.selectedStore?.roles?.length > 0 && (
                <div className="text-sm text-base-content flex flex-col gap-2">
                  <p className="font-medium">Assigned Roles:</p>
                  <div className="flex flex-wrap gap-2">
                    {state.selectedStore?.roles?.map((role: any) => (
                      <Badge key={role.id} color="primary">
                        {role.group}{" "}
                        <Icon
                          icon={xIcon}
                          onClick={() => handleRemoveRole(role?.id)}
                          className="cursor-pointer"
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ModalBody>
          <ModalActions>
            <Button
              color="error"
              size="sm"
              onClick={() => {
                dispatch({ type: "SET_OPEN_MODAL", payload: false });
                dispatch({ type: "SET_SELECTED_STORE", payload: null });
                dispatch({ type: "SET_SELECTED_GROUP_ID", payload: null });
              }}
            >
              No
            </Button>
            <Button
              color="primary"
              size="sm"
              loading={state.isLoading}
              onClick={handleAssignPermission}
            >
              Yes
            </Button>
          </ModalActions>
        </ModalLegacy>
      </Card>
    </>
  );
};

export default RolesGrid;
