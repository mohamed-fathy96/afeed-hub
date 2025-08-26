import React from "react";
interface Props {
  requiredPermissions: string;
}
const PermissionsCannotAccess: React.FC<Props> = ({ requiredPermissions }) => {
  return (
    <div className="flex justify-center items-center w-full h-full bg-base-100">
      <div className="border border-base-content rounded-lg p-10 max-w-lg text-center shadow-md bg-base-100">
        <h1 className="text-red-500 text-2xl font-bold mb-4">403 error</h1>
        <h3 className="text-base-content text-lg font-medium mb-3">
          Unauthorized access!
        </h3>
        <p className="text-base-content text-base">
          We are sorry but you don&apos;t have the required permission/s to
          access this page you need to have the following permission/s:{" "}
          {requiredPermissions}
        </p>
      </div>
    </div>
  );
};

export default PermissionsCannotAccess;
