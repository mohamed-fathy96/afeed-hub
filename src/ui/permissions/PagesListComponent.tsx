import React, { useState, useEffect } from "react";

import RemovePageModal from "./RemovePageModal";
import { SectionLoader } from "../SectionLoader";
import { DataGridTable } from "../Datagrid";
import AddNewPageModal from "./AddNewPageModal";
import PermissionsService from "@app/services/actions/permissionService";
import { useToast } from "@app/helpers/hooks/use-toast";
import { Button } from "@app/ui";
import DataGridGroupingTable from "../Datagrid/DataGridGroupingTable";
import { Icon } from "@app/ui/Icon";
import PlusIcon from "@iconify/icons-lucide/plus";
import TrashIcon from "@iconify/icons-lucide/trash";
// API

interface PagesListComponentProps {
  isAddNewPageModalOpen: boolean;
  setIsAddNewPageModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PagesListComponent: React.FC<PagesListComponentProps> = ({
  isAddNewPageModalOpen,
  setIsAddNewPageModalOpen,
}) => {
  const [params] = useState({
    searchKey: "",
  });
  const [selectedPage, setSelectedPage] = useState<any>({});
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);
  const [isRemovePageModalOpen, setIsRemovePageModalOpen] = useState(false);
  const [pagesData, setPagesData] = useState<any[]>([]); // Replace 'any' with the actual type
  const [pageId, setPageId] = useState<string>("");
  const toast = useToast();
  const fetchPagesList = async () => {
    setIsLoaderOpen(true);
    try {
      const res = await PermissionsService.getAllPermissions();
      setPagesData(res.data);
      setIsLoaderOpen(false);
    } catch (err: any) {
      setIsLoaderOpen(false);
      toast.error(err?.response?.data?.message ?? "Failed to get pages list");
    }
  };
  const handleAddPermission = (data: any) => {
    setIsAddNewPageModalOpen(true);
    setSelectedPage(data);
  };
  useEffect(() => {
    fetchPagesList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Columns
  const columns = [
    {
      title: "Page Name",
      field: "page",
    },
    {
      title: "Actions",
      render: (data: any) => (
        <div className="flex">
          <Button onClick={() => handleAddPermission(data)} color="primary">
            <Icon icon={PlusIcon} />
          </Button>
        </div>
      ),
    },
  ];

  // Options
  const options = {
    paging: false,
    showTitle: false,
    toolbar: false,
  };

  const nestedColumns = [
    {
      title: "ID",
      field: "id",
    },
    {
      title: "Page Name",
      field: "page",
    },
    {
      title: "Permission Key",
      field: "permissionKey",
    },
    {
      title: "Actions",
      render: (data: any) => (
        <div className="flex">
          <Button
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              setPageId(data.id);
              setIsRemovePageModalOpen(true);
            }}
          >
            <Icon icon={TrashIcon} />
          </Button>
        </div>
      ),
    },
  ];
  const detailPanel = (rowData: any) => {
    return (
      <DataGridTable columns={nestedColumns} data={rowData?.permissions} />
    );
  };
  return (
    <div>
      {isLoaderOpen ? (
        <SectionLoader />
      ) : (
        <>
          <DataGridGroupingTable
            data={pagesData}
            detailPanel={detailPanel}
            columns={columns}
            options={options}
          />
        </>
      )}
      {isAddNewPageModalOpen && (
        <AddNewPageModal
          selectedPage={selectedPage}
          isAddNewPageModalOpen={isAddNewPageModalOpen}
          setIsAddNewPageModalOpen={setIsAddNewPageModalOpen}
          fetchPagesList={fetchPagesList}
          params={params}
          setSelectedPage={setSelectedPage}
        />
      )}
      {isRemovePageModalOpen && (
        <RemovePageModal
          isRemovePageModalOpen={isRemovePageModalOpen}
          setIsRemovePageModalOpen={setIsRemovePageModalOpen}
          fetchPagesList={fetchPagesList}
          pageId={pageId}
          params={params}
        />
      )}
    </div>
  );
};

export default PagesListComponent;
