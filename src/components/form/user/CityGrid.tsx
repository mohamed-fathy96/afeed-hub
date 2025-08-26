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
import { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import useRolesReducer from "./use-roles-reducer";
import xIcon from "@iconify/icons-lucide/x";
import SingleSelectDropdown from "@app/ui/SingleDropDown/SingleSelectDropdown";
import { Icon } from "@app/ui/Icon";
import { PageTitle } from "@app/ui/PageTitle";
export interface GridProps {
  roles: any[];
  userId: number;
  fetchRoles: () => void;
}

const CityGrid = ({ roles, userId, fetchRoles }: GridProps) => {
  const toast = useToast();
  const { state, dispatch } = useRolesReducer();

  const formatFetchedCities = (cities: any[]) => {
    return cities.map((city) => {
      const storeRoles = roles.filter((role) => role.roleableId === city.id);
      return {
        ...city,
        roles: storeRoles,
        isAssigned: storeRoles.length > 0,
      };
    });
  };
  const fetchData = async () => {
    dispatch({ type: "SET_IS_LOADER_OPEN", payload: true });
    try {
      const [groupsResponse, storesResponse] = await Promise.all([
        GlobalService.getAllCities(),
        GlobalService.getAllCitiesGroups(),
      ]);
      dispatch({ type: "SET_CITY_ROLES", payload: groupsResponse.data });
      dispatch({ type: "SET_STORES_LIST", payload: storesResponse.data });
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to fetch data");
    } finally {
      dispatch({ type: "SET_IS_LOADER_OPEN", payload: false });
    }
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenModal = (store: any) => {
    dispatch({ type: "SET_SELECTED_CITY_ROLE", payload: store });
    dispatch({ type: "SET_OPEN_MODAL", payload: true });
  };
  const handleRemoveRole = async (roleId: number) => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    try {
      const res = await UserService.removeAssignedCity(userId, roleId);
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
  const handleAssignPermission = async () => {
    dispatch({ type: "SET_IS_LOADING", payload: true });
    if (!state.selectedStore) {
      toast.error("Please select a group");
      dispatch({ type: "SET_IS_LOADING", payload: false });
      return;
    }
    const data = {
      groupId: state.selectedCityRole?.id,
      cityIds: [state.selectedStore?.id],
    };
    try {
      const res = await UserService.assignCityRoleToUser(data, userId);
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

  return (
    <Card className="space-y-6 mt-6">
      <CardBody className="bg-base-100">
        <PageTitle title="Assign City Roles" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {formatFetchedCities(state.cityRoles).map((city) => (
            <CardBody
              key={city?.id}
              className={twMerge(
                "rounded-lg p-6 bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200 hover:cursor-pointer",
                city?.isAssigned
                  ? "border-2 border-primary"
                  : "border border-base-200"
              )}
              onClick={() => handleOpenModal(city)}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-base-content">
                  {city.name}
                </h3>
                <span className="text-sm text-base-content">#{city.id}</span>
              </div>

              <div className="text-sm text-base-content flex flex-col gap-2">
                <p className="font-medium">Assigned Stores:</p>
                {city?.roles?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {city?.roles?.map((role: any) => (
                      <Badge key={role.id} color="primary">
                        {role.group}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p>No city level assigned </p>
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
          Level: {state.selectedCityRole?.roleGroupName}
          <form method="dialog">
            <Button
              size="sm"
              shape="circle"
              className="absolute right-2 top-2"
              aria-label="Close modal"
              onClick={() => {
                dispatch({ type: "SET_OPEN_MODAL", payload: false });
                dispatch({ type: "SET_SELECTED_CITY_ROLE", payload: null });
                dispatch({ type: "SET_SELECTED_GROUP_ID", payload: null });
              }}
            >
              <Icon icon={xIcon} />
            </Button>
          </form>
        </ModalHeader>
        <ModalBody>
          <SingleSelectDropdown
            options={state.storesList}
            optionValue="id"
            optionName="roleGroupName"
            placeholder="Select a Store"
            selectedValue={state?.selectedStore?.id}
            handleChange={(_e, value) =>
              dispatch({ type: "SET_SELECTED_STORE", payload: value })
            }
          />
          <div className="mt-4">
            {state.selectedStore?.roles?.length > 0 && (
              <div className="text-sm text-base-content flex flex-col gap-2">
                <p className="font-medium">Assigned Store:</p>
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
  );
};
export default CityGrid;
