import { toast } from "sonner";

const useToast = () => {
    const show = (message: string) => {
        toast(message);
    };

    const showSuccess = (message: string) => {
        toast.success(message);
    };

    const showError = (message: string) => {
        toast.error(message);
    };

    return {
        show,
        success: showSuccess,
        error: showError,
    };
};

export { useToast };
