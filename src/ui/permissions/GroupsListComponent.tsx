import React, { useState, useEffect } from "react";
import classes from "./Permissions.module.scss";
import { useNavigate } from "react-router-dom";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { SectionLoader } from "../SectionLoader";
import { DataGridTable } from "../Datagrid";
import AddNewGroupModal from "./AddNewGroupModal";
import RemoveGroupModal from "./RemoveGroupModal";
// import { getEditGroup } from '@app/routing/routingConstants/AppUrls';
import { useToast } from "@app/helpers/hooks/use-toast";
import PermissionsService from "@app/services/actions/permissionService";
import { routes } from "@app/lib/routes";
import { Button } from "@app/ui";
// Components
interface GroupsListComponentProps {
  isAddNewGroupModalOpen: boolean;
  setIsAddNewGroupModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const GroupsListComponent: React.FC<GroupsListComponentProps> = ({
  isAddNewGroupModalOpen,
  setIsAddNewGroupModalOpen,
}) => {
  const [params] = useState({
    searchKey: "",
  });
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [isRemoveGroupModalOpen, setIsRemoveGroupModalOpen] = useState(false);
  const [groupsData, setGroupsData] = useState<any[]>([]); // Replace 'any' with the actual type
  const [groupId, setGroupId] = useState<string>("");
  const navigate = useNavigate();
  const toast = useToast();
  const fetchGroupsList = async (params: { searchKey: string }) => {
    setIsLoaderOpen(true);
    try {
      const res = await PermissionsService.getGroupsList({
        searchKey: params.searchKey || null,
      });
      setGroupsData(res.data);
      setIsLoaderOpen(false);
    } catch (err: any) {
      setIsLoaderOpen(false);
      toast.error(err?.response?.data?.message ?? "Failed to get Groups list");
    }
  };

  useEffect(() => {
    fetchGroupsList(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Columns
  const columns = [
    {
      title: "Group Name",
      field: "roleGroupName",
    },
    {
      title: "",
      render: (data: any) => (
        <div className={classes.actionsWrapper}>
          <Button
            color="primary"
            onClick={() =>
              navigate(routes.dashboard.permissions.group.edit(data.id))
            }
          >
            Edit
          </Button>
          <DeleteForeverIcon
            onClick={(e) => {
              e.stopPropagation();
              setGroupId(data.id);
              setIsRemoveGroupModalOpen(true);
            }}
            className={classes.removeIcon}
          />
        </div>
      ),
    },
  ];

  const onRowClick = (_evt: React.MouseEvent, row: any) => {
    navigate(routes.dashboard.permissions.group.edit(row.id));
  };

  return (
    <div>
      {isLoaderOpen ? (
        <SectionLoader />
      ) : (
        <>
          <DataGridTable
            data={groupsData}
            columns={columns}
            options={{ grouping: false }}
            onRowClick={onRowClick}
          />
        </>
      )}
      {isAddNewGroupModalOpen && (
        <AddNewGroupModal
          isAddNewGroupModalOpen={isAddNewGroupModalOpen}
          setIsAddNewGroupModalOpen={setIsAddNewGroupModalOpen}
          fetchGroupsList={fetchGroupsList}
          params={params}
        />
      )}
      {isRemoveGroupModalOpen && (
        <RemoveGroupModal
          isRemoveGroupModalOpen={isRemoveGroupModalOpen}
          setIsRemoveGroupModalOpen={setIsRemoveGroupModalOpen}
          fetchGroupsList={fetchGroupsList}
          groupId={groupId}
          params={params}
        />
      )}
    </div>
  );
};

export default GroupsListComponent;
