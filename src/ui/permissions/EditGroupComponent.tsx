import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import { InputField } from "../InputField";
import { useToast } from "@app/helpers/hooks/use-toast";
import PermissionsService from "@app/services/actions/permissionService";
import {
  Accordion,
  AccordionContent,
  AccordionTitle,
  Button,
  CardBody,
} from "@app/ui";
import { PageTitle } from "../PageTitle";
interface EditGroupComponentProps {
  groupDetails: number[];
  groupName: string;
  groupId: number;
  permissionsData: {
    page: string;
    permissions: {
      id: number;
      permissionKey: string;
      description: string;
      page: string;
    }[];
  }[];
}

const EditGroupComponent: React.FC<EditGroupComponentProps> = ({
  groupDetails,
  groupId,
  permissionsData,
  groupName,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [checkedActionIds, setCheckedActionIds] = useState<string[]>([]);
  const toast = useToast();

  useEffect(() => {
    const initialCheckedActionIds: string[] = [];

    // Extract IDs from groupDetails
    const groupIds = new Set(groupDetails);

    // Check pagesData permissions and match with groupDetails IDs
    permissionsData.forEach((page: any) => {
      page.permissions.forEach((permission: any) => {
        if (groupIds.has(permission.id)) {
          initialCheckedActionIds.push(permission.id.toString());
        }
      });
    });

    setCheckedActionIds(initialCheckedActionIds);
  }, [groupDetails, permissionsData]);

  const handleCheckboxChange = (actionId: string) => {
    setCheckedActionIds((prevIds) => {
      if (prevIds.includes(actionId)) {
        // Remove the actionId if already present
        return prevIds.filter((id) => id !== actionId);
      } else {
        // Add the actionId if not already present
        return [...prevIds, actionId];
      }
    });
  };

  const handleAssignActionsToGroup = async () => {
    setIsLoading(true);
    const permissionIds = checkedActionIds.map((id) => Number(id));

    const dataBody = {
      permissionIds,
    };
    try {
      const res = await PermissionsService.assignActionsToGroup(
        dataBody,
        groupId
      );
      toast.success(res?.data?.message ?? "Actions assigned successfully");
      setIsLoading(false);
    } catch (err: any) {
      setIsLoading(false);
      toast.error(
        err?.response?.data?.message ?? "Failed to update group actions"
      );
    }
  };

  return (
    <>
      <div className="w-full mb-3">
        <PageTitle
          title={"Edit Group Actions"}
          breadCrumbItems={[
            { label: "Groups", active: false },
            { label: groupName, active: true },
          ]}
        />
      </div>
      <CardBody className=" mx-auto bg-base-100">
        <div className="flex justify-between">
          <div>
            <h2 className="text-lg font-semibold text-base-content">
              Edit Group Actions
            </h2>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="w-1/2">
            <InputField value={groupName} label="Group Name" disabled />
          </div>
        </div>
        <hr className="my-5" />
        <h3 className="text-md font-semibold text-base-content">
          Page Actions
        </h3>
        <div className="space-y-3">
          {permissionsData?.map((item: any, index: number) => (
            <Accordion
              key={item.page}
              className="border rounded-lg"
              tabIndex={index}
              icon="arrow"
            >
              <AccordionTitle>{item.page}</AccordionTitle>
              <AccordionContent>
                <div className="mb-2">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={item.permissions.every((action: any) =>
                          checkedActionIds.includes(action.id.toString())
                        )}
                        indeterminate={
                          item.permissions.some((action: any) =>
                            checkedActionIds.includes(action.id.toString())
                          ) &&
                          !item.permissions.every((action: any) =>
                            checkedActionIds.includes(action.id.toString())
                          )
                        }
                        onChange={(e) => {
                          const allIds = item.permissions.map((action: any) =>
                            action.id.toString()
                          );
                          if (e.target.checked) {
                            // Select all permissions in the accordion
                            setCheckedActionIds((prev) => [
                              ...prev,
                              ...allIds.filter((id: any) => !prev.includes(id)),
                            ]);
                          } else {
                            // Deselect all permissions in the accordion
                            setCheckedActionIds((prev) =>
                              prev.filter((id) => !allIds.includes(id))
                            );
                          }
                        }}
                      />
                    }
                    label="Select All"
                  />
                </div>
                {item?.permissions?.map((action: any) => (
                  <FormControlLabel
                    key={action.id}
                    control={
                      <Checkbox
                        checked={checkedActionIds.includes(
                          action.id.toString()
                        )}
                        onChange={() =>
                          handleCheckboxChange(action.id.toString())
                        }
                      />
                    }
                    label={action.permissionKey}
                  />
                ))}
              </AccordionContent>
            </Accordion>
          ))}
        </div>
        <div className="flex justify-start mt-5">
          <Button
            onClick={handleAssignActionsToGroup}
            color="primary"
            disabled={isLoading}
          >
            Save
          </Button>
        </div>
      </CardBody>
    </>
  );
};

export default EditGroupComponent;
