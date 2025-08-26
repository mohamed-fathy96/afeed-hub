import React from "react";
import { Icon } from "@app/ui/Icon";

export type SectionHeaderType = "primary" | "success" | "error" | "warning" | "info" | "default";

interface SectionHeaderProps {
  type?: SectionHeaderType;
  title: string;
  description: string;
  icon?: string;
  className?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  type = "default",
  title,
  description,
  icon,
  className = "",
  iconClassName = "",
  titleClassName = "",
  descriptionClassName = "",
}) => {
  const getTypeStyles = (type: SectionHeaderType) => {
    const styles = {
      primary: {
        container: "bg-primary/10",
        icon: "text-primary",
      },
      success: {
        container: "bg-success/10",
        icon: "text-success",
      },
      error: {
        container: "bg-error/10",
        icon: "text-error",
      },
      warning: {
        container: "bg-warning/10",
        icon: "text-warning",
      },
      info: {
        container: "bg-info/10",
        icon: "text-info",
      },
      default: {
        container: "bg-base-200/50",
        icon: "text-base-content/70",
      },
    };
    return styles[type];
  };

  const typeStyles = getTypeStyles(type);
  const defaultIcon = {
    primary: "lucide:info",
    success: "lucide:check-circle",
    error: "lucide:alert-circle",
    warning: "lucide:alert-triangle",
    info: "lucide:info",
    default: "lucide:info",
  };

  return (
    <div className={`flex items-center gap-3 mb-6 ${className}`}>
      <div className={`w-10 h-10 ${typeStyles.container} rounded-lg flex items-center justify-center ${iconClassName}`}>
        <Icon
          icon={icon || defaultIcon[type]}
          className={`w-5 h-5 ${typeStyles.icon}`}
        />
      </div>
      <div>
        <h3 className={`text-lg font-semibold text-base-content ${titleClassName}`}>
          {title}
        </h3>
        <p className={`text-sm text-base-content/60 ${descriptionClassName}`}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default SectionHeader; 