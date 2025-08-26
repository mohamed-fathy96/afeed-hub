import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Grid } from "@material-ui/core";
import EditGroupComponent from "@app/ui/permissions/EditGroupComponent";
import { SectionLoader } from "@app/ui/SectionLoader";
import PermissionsService from "@app/services/actions/permissionService";
import { useToast } from "@app/helpers/hooks/use-toast";

const EditGroupPage: React.FC = () => {
  const params = useParams<{ id: string }>();
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  interface GroupDetails {
    permissions: number[];
    name: string;
    // add other properties if needed
  }

  const [groupDetails, setGroupDetails] = useState<GroupDetails[] | null>(null);
  const [permissionsData, setPermissionsData] = useState<any[]>([]);

  const toast = useToast();
  const fetchGroupDetailsById = async (groupId: number) => {
    setIsLoaderOpen(true);
    try {
      const res = await PermissionsService.getGroupDetails(groupId);
      setGroupDetails(res?.data);
      setIsLoaderOpen(false);
    } catch (err: any) {
      setIsLoaderOpen(false);
      toast.error(err?.response?.data?.message ?? "Failed to get group data");
    }
  };
  const fetchPagesList = async () => {
    setIsLoaderOpen(true);
    try {
      const res = await PermissionsService.getAllPermissions();
      setPermissionsData(res.data);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ?? "Failed to get Permissions list"
      );
    } finally {
      setIsLoaderOpen(false);
    }
  };

  useEffect(() => {
    fetchGroupDetailsById(Number(params?.id));
    fetchPagesList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);

  return (
    <Grid>
      {isLoaderOpen ? (
        <SectionLoader />
      ) : (
        <EditGroupComponent
          permissionsData={permissionsData}
          groupDetails={groupDetails?.[0]?.permissions || []}
          groupId={Number(params?.id)}
          groupName={groupDetails?.[0]?.name || ""}
        />
      )}
    </Grid>
  );
};

export default EditGroupPage;
