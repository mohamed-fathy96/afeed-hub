import React, { useState } from "react";
import PermissionsHeader from "@app/ui/permissions/PermissionsHeader";
import PagesListComponent from "@app/ui/permissions/PagesListComponent";
import { Card } from "@material-ui/core";
import { CardBody } from "@app/ui";

export const PagePermissionsPage: React.FC = () => {
  const [isAddNewPageModalOpen, setIsAddNewPageModalOpen] = useState(false);
  return (
    <Card>
      <CardBody className="bg-base-100">
        <PermissionsHeader
          title={"Pages Permissions"}
          btnTitle={"Add New Page"}
          onClick={() => setIsAddNewPageModalOpen(true)}
        />
        <PagesListComponent
          isAddNewPageModalOpen={isAddNewPageModalOpen}
          setIsAddNewPageModalOpen={setIsAddNewPageModalOpen}
        />
      </CardBody>
    </Card>
  );
};
