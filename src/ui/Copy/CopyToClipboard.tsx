import { Button, Tooltip } from "@app/ui";
import CopyIcon from "@iconify/icons-lucide/copy";
import { Icon } from "@app/ui/Icon";
import { useToast } from "@app/helpers/hooks/use-toast";
export const CopyToClipboard = ({
  text,
  // position = "top",
}: {
  text: string;
  // position?: "top" | "bottom" | "left" | "right" | undefined;
}) => {
  const toast = useToast();

  const handleCopy = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success(`Copied: ${text}`);
    }
  };

  return (
    // <Tooltip message="Copy to clipboard" position={position}>
      <Button
        size="sm"
      
        onClick={handleCopy}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        <Icon icon={CopyIcon} />
      </Button>
    // </Tooltip>
  );
};
