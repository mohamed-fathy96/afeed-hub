import {
  Button,
  ModalActions,
  ModalBody,
  ModalHeader,
  ModalLegacy,
} from "@app/ui";
import { Icon } from "@app/ui/Icon";
import xIcon from "@iconify/icons-lucide/x";

interface SaveConfirmationModalProps {
  isConfirmOpen: boolean;
  setIsConfirmOpen: (open: boolean) => void;
  handleSave: () => void;
  modalContent: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  };
  buttonTxt: string;
}

const SaveConfirmationModal = ({
  isConfirmOpen,
  setIsConfirmOpen,
  handleSave,
  modalContent,
  buttonTxt,
}: SaveConfirmationModalProps) => {
  return (
    <ModalLegacy
      onClickBackdrop={() => setIsConfirmOpen(false)}
      open={isConfirmOpen}
      role="dialog"
    >
      <ModalHeader className="font-bold">
        {modalContent?.title}
        <form method="dialog">
          <Button
            size="sm"
            shape="circle"
            className="absolute right-2 top-2"
            aria-label="Close modal"
            onClick={() => {
              setIsConfirmOpen(false);
            }}
          >
            <Icon icon={xIcon} />
          </Button>
        </form>
      </ModalHeader>

      <ModalBody>
        <p className="text-base-content font-semibold ">
          {modalContent?.description}
        </p>
      </ModalBody>
      <ModalActions>
        <Button onClick={() => setIsConfirmOpen(false)}>Cancel</Button>
        <Button onClick={handleSave} color="primary">
          {buttonTxt}
        </Button>
      </ModalActions>
    </ModalLegacy>
  );
};

export default SaveConfirmationModal;
