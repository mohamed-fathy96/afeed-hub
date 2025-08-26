import React, { useState, useEffect, useCallback } from "react";
import { DataGridTable } from "@app/ui/Datagrid";
import { SectionLoader } from "@app/ui/SectionLoader";
import { useToast } from "@app/helpers/hooks/use-toast";
import { PageTitle } from "@app/ui/PageTitle";

import { DropboxService } from "@app/services/actions";
import {
  Button,
  Card,
  Drawer,
  ModalActions,
  ModalBody,
  ModalHeader,
  ModalLegacy,
  Radio,
} from "@app/ui";
import { ImageWithFallback } from "@app/ui/Image";
import { Icon } from "@app/ui/Icon";
import xIcon from "@iconify/icons-lucide/x";
import StateIcon from "@iconify/icons-lucide/eye";
import FilterSection from "./components/FilterSection";
import { APP_CONFIG } from "@app/services/apiService/Config";

const DropboxPage: React.FC = () => {
  const base = `${APP_CONFIG.gateway}catalog/api/dropbox/get-image`;

  // Grouped state declarations; removed refs
  const [dataList, setDataList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [isLoaderOpen, setIsLoaderOpen] = useState<boolean>(false);
  const [requestFile, setRequestFile] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [exportModal, setExportModal] = useState(false);
  const [exportOption, setExportOption] = useState<
    "overrideExisting" | "skipIfHasImages"
  >("overrideExisting");

  const toast = useToast();

  // Use useEffect for file fetching when requestFile changes
  useEffect(() => {
    if (requestFile) {
      setIsLoaderOpen(true);
      DropboxService.getDropboxFile(requestFile)
        .then((res) => {
          setDataList(res?.data);
          setSelectedRows([]);
        })
        .catch((err: any) => {
          if (err.name !== "AbortError")
            toast.error(err?.response?.data?.message ?? "Failed to get file");
        })
        .finally(() => setIsLoaderOpen(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestFile]);

  // Export folder remains similar
  const handleExportFolder = async () => {
    const data = {
      overrideExisting: exportOption === "overrideExisting" ? true : false,
      skipIfHasImages: exportOption === "skipIfHasImages" ? true : false,
      ids: selectedRows,
    };
    try {
      const res = await DropboxService.selectFiles(data);
      setPreviewImage(res?.data);
      setExportModal(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Failed to export folder");
    }
  };

  // Drawer control: now store the selected folder id and open drawer
  const openDrawer = useCallback((item: any) => {
    if (item?.id) {
      setPreviewImage(base + `?id=${item.id}`);
      setDrawerOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
    setPreviewImage(null);
  }, []);

  // Columns remain unchanged except openDrawer usage
  const columns = [
    { title: "ID", field: "id" },
    { title: "Name", field: "name" },

    {
      title: "Actions",
      render: (rowData: any) => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            color="primary"
            startIcon={<Icon icon={StateIcon} />}
            onClick={() => openDrawer(rowData)}
          >
            View
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Header and title */}
      <div className="flex flex-col mb-6">
        <div className="w-full">
          <PageTitle
            title="Dropbox"
            breadCrumbItems={[{ label: "Dropbox", active: true }]}
          />
        </div>
      </div>
      {/* Main content */}
      <div className="mx-auto bg-base-100 shadow-md rounded-lg p-6 space-y-4">
        <FilterSection
          requestFile={requestFile}
          setRequestFile={setRequestFile}
        />
        <div className="flex justify-end">
          <Button
            color="primary"
            size="sm"
            disabled={!selectedRows?.length}
            onClick={() => {
              setExportModal(true);
            }}
          >
            Update Selected Products
          </Button>
        </div>
        {isLoaderOpen ? (
          <SectionLoader />
        ) : (
          <>
            <DataGridTable
              data={dataList}
              columns={columns}
              options={{
                actionsColumnIndex: -1,
                selection: true,
                grouping: false,
              }}
              onSelectionChange={(rows) => {
                const rowIds = rows.map((row: any) => row.id);

                setSelectedRows(rowIds);
              }}
            />
            <Drawer
              open={drawerOpen}
              end
              onClickOverlay={closeDrawer}
              sideClassName={"z-[100]"}
              side={
                <Card className="rounded-t-lg bg-base-100 h-full border-none overflow-y-auto w-96 m-3">
                  <div className="bg-[#EDF0FE] p-4">
                    <Button
                      size="sm"
                      type="button"
                      shape="circle"
                      className="absolute right-2 top-2"
                      aria-label="Close Drawer"
                      onClick={closeDrawer}
                    >
                      <Icon icon={xIcon} />
                    </Button>
                    <h4 className="font-bold">Preview</h4>
                  </div>
                  <div className="p-3 space-y-3">
                    <div>
                      {previewImage && <ImageWithFallback src={previewImage} />}
                    </div>
                  </div>
                </Card>
              }
            />
            <ModalLegacy
              onClickBackdrop={() => {
                setExportModal(false);
              }}
              open={exportModal}
              role="dialog"
            >
              <form method="dialog">
                <Button
                  size="sm"
                  shape="circle"
                  className="absolute right-2 top-2"
                  aria-label="Close modal"
                  onClick={() => {
                    setExportModal(false);
                  }}
                >
                  <Icon icon={xIcon} />
                </Button>
              </form>
              <ModalHeader className="font-bold">Confirm</ModalHeader>
              <ModalBody>
                {/* Added radio buttons */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="overrideExisting"
                    className="flex items-center gap-2"
                  >
                    <Radio
                      name="overrideExisting"
                      value="overrideExisting"
                      checked={exportOption === "overrideExisting"}
                      onChange={() => setExportOption("overrideExisting")}
                    />
                    Override Existing
                  </label>
                  <label
                    htmlFor="skipIfHasImages"
                    className="flex items-center gap-2"
                  >
                    <Radio
                      name="skipIfHasImages"
                      value="skipIfHasImages"
                      checked={exportOption === "skipIfHasImages"}
                      onChange={() => setExportOption("skipIfHasImages")}
                    />
                    Skip If Has Images
                  </label>
                </div>
              </ModalBody>
              <ModalActions>
                <form method="dialog">
                  <Button
                    color="error"
                    size="sm"
                    onClick={() => {
                      setExportModal(false);
                    }}
                  >
                    Cancel
                  </Button>
                </form>
                <form method="dialog">
                  <Button
                    color="primary"
                    size="sm"
                    onClick={handleExportFolder}
                  >
                    Update
                  </Button>
                </form>
              </ModalActions>
            </ModalLegacy>
          </>
        )}
      </div>
    </>
  );
};

export default DropboxPage;
