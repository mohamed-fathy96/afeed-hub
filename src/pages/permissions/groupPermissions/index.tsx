import React, { useState } from "react";
import PermissionsHeader from "@app/ui/permissions/PermissionsHeader";
import GroupsListComponent from "@app/ui/permissions/GroupsListComponent";
import { Card, CardBody } from "@app/ui";

export const GroupPermissionsPage: React.FC = () => {
  const [isAddNewGroupModalOpen, setIsAddNewGroupModalOpen] = useState(false);
  return (
    <Card>
      <CardBody className="bg-base-100">
        <PermissionsHeader
          title="Groups Permissions"
          btnTitle="Add New Groups"
          onClick={() => setIsAddNewGroupModalOpen(true)}
        />
        <GroupsListComponent
          isAddNewGroupModalOpen={isAddNewGroupModalOpen}
          setIsAddNewGroupModalOpen={setIsAddNewGroupModalOpen}
        />
      </CardBody>
    </Card>
  );
};
