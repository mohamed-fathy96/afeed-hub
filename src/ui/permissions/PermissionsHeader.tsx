import React from "react";
import { Button, Card, CardBody } from "@app/ui";

interface PermissionsHeaderProps {
  title: string;
  btnTitle?: string;
  onClick: () => void;
}

const PermissionsHeader: React.FC<PermissionsHeaderProps> = ({
  title,
  btnTitle,
  onClick,
}) => {
  return (
    <Card >
      <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center  p-4 bg-base-100">
        {/* Title and Search Section */}
        <div className="flex items-center space-x-4">
          <h3 className="hidden sm:block text-lg font-medium text-base-content">{title}</h3>
        </div>

        {/* Button Section */}
        <div className="flex justify-end md:justify-end">
          <Button variant="outline" color="primary" onClick={onClick}>
            {btnTitle}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default PermissionsHeader;
