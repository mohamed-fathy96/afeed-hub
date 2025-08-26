import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalActions,
  Alert,
} from "@app/ui";
import { InputField } from "@app/ui/InputField";
import { User } from "@app/lib/types/users";
import { formatToLocalTime } from "@app/lib/utils/formatDate";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@app/services/actions";
import { useToast } from "@app/helpers/hooks/use-toast";
import { Icon } from "@app/ui/Icon";
import banIcon from "@iconify/icons-lucide/ban";
import RestrictedWrapper from "@app/routing/routingComponents/RestrictedWrapper";

interface Props {
  data: User;
  onDataRefresh?: () => void;
}

const UserForm: React.FC<Props> = ({ data, onDataRefresh }) => {
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const toast = useToast();
  const queryClient = useQueryClient();

  const blockUserMutation = useMutation({
    mutationFn: async (blocked: boolean) => {
      return await UserService.blockUser(blocked, data.id);
    },
    onSuccess: (res) => {
      toast.success(
        res?.data?.message ??
          `User ${data.blocked ? "unblocked" : "blocked"} successfully`
      );
      setIsBlockModalOpen(false);
      // Invalidate user queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", data.id] });
      // Call the refresh callback if provided
      if (onDataRefresh) {
        onDataRefresh();
      }
    },
    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ??
          `Failed to ${data.blocked ? "unblock" : "block"} user`
      );
    },
  });

  const handleBlockUser = () => {
    blockUserMutation.mutate(!data.blocked);
  };

  return (
    <>
      <Card>
        <CardBody className="bg-base-100 grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField id="name" label="Name" value={data.name} disabled />
          <InputField id="email" label="Email" value={data.email} disabled />
          {data.phoneNumber && (
            <InputField
              id="phoneNumber"
              label="Phone Number"
              value={`${data.countryCode}${data.phoneNumber}`}
              disabled
            />
          )}

          <InputField
            id="archived"
            label="Archived"
            value={data.archived ? "Yes" : "No"}
            disabled
          />
          <InputField
            id="blocked"
            label="Blocked"
            value={data.blocked ? "Yes" : "No"}
            disabled
          />

          <InputField
            id="smsCode"
            label="SMS Code"
            value={data.smsCode}
            disabled
          />
          <InputField
            id="smsCodeExpiresAt"
            label="SMS Code Expires At"
            value={formatToLocalTime(data.smsCodeExpiresAt)}
            disabled
          />
          {data.lastSignInAt && (
            <InputField
              id="lastSignInAt"
              label="Last Sign-In At"
              value={formatToLocalTime(data.lastSignInAt)}
              disabled
            />
          )}
          <InputField
            id="createdAt"
            label="Created At"
            value={formatToLocalTime(data.createdAt)}
            disabled
          />

          <div className="md:col-span-2 flex justify-end">
            <RestrictedWrapper requiredPermissions="users" action="block_user">
              <Button
                color={data.blocked ? "success" : "error"}
                startIcon={<Icon icon={banIcon} />}
                onClick={() => setIsBlockModalOpen(true)}
                loading={blockUserMutation.isPending}
                disabled={blockUserMutation.isPending}
              >
                {data.blocked ? "Unblock User" : "Block User"}
              </Button>
            </RestrictedWrapper>
          </div>
        </CardBody>
      </Card>

      {/* Block User Confirmation Modal */}
      <Modal
        open={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        responsive
      >
        <ModalHeader>
          {data.blocked ? "Unblock User" : "Block User"}
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p>
              Are you sure you want to {data.blocked ? "unblock" : "block"} user{" "}
              <strong>{data.name}</strong> ({data.email})?
            </p>
            {!data.blocked && (
              <Alert className="mt-2 bg-warning/10 text-warning">
                This action will prevent the user from creating new orders.
              </Alert>
            )}
          </div>
        </ModalBody>
        <ModalActions>
          <Button
            variant="outline"
            onClick={() => setIsBlockModalOpen(false)}
            disabled={blockUserMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            color={data.blocked ? "success" : "error"}
            onClick={handleBlockUser}
            loading={blockUserMutation.isPending}
            disabled={blockUserMutation.isPending}
          >
            {data.blocked ? "Unblock" : "Block"} User
          </Button>
        </ModalActions>
      </Modal>
    </>
  );
};

export default UserForm;
