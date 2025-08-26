import React from "react";
import { Icon } from "@app/ui/Icon";

export type CheckboxCardType = "primary" | "success" | "error" | "warning" | "info";

interface CheckboxCardProps {
  type?: CheckboxCardType;
  name: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  description: string;
  icon?: string;
  className?: string;
}

const CheckboxCard: React.FC<CheckboxCardProps> = ({
  type = "primary",
  name,
  checked,
  onChange,
  title,
  description,
  icon,
  className = "",
}) => {
  const getTypeStyles = (type: CheckboxCardType) => {
    const styles = {
      primary: {
        container: "from-primary/5 to-primary/10 border-primary/20 hover:border-primary/30",
        checkbox: "checkbox-primary",
        icon: "text-primary",
      },
      success: {
        container: "from-success/5 to-success/10 border-success/20 hover:border-success/30",
        checkbox: "checkbox-success",
        icon: "text-success",
      },
      error: {
        container: "from-error/5 to-error/10 border-error/20 hover:border-error/30",
        checkbox: "checkbox-error",
        icon: "text-error",
      },
      warning: {
        container: "from-warning/5 to-warning/10 border-warning/20 hover:border-warning/30",
        checkbox: "checkbox-warning",
        icon: "text-warning",
      },
      info: {
        container: "from-info/5 to-info/10 border-info/20 hover:border-info/30",
        checkbox: "checkbox-info",
        icon: "text-info",
      },
    };
    return styles[type];
  };

  const typeStyles = getTypeStyles(type);
  const defaultIcon = {
    primary: "lucide:percent",
    success: "lucide:eye",
    error: "lucide:alert-circle",
    warning: "lucide:alert-triangle",
    info: "lucide:info",
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${typeStyles.container} border p-4 transition-all duration-200 hover:shadow-md ${className}`}
    >
      <div className="flex items-center gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            name={name}
            checked={checked}
            onChange={onChange}
            className={`checkbox checkbox-lg ${typeStyles.checkbox}`}
          />
        </label>
        <label className="flex-1 cursor-pointer">
          <div className="flex items-center gap-2 mb-1">
            <Icon
              icon={icon || defaultIcon[type]}
              className={`w-5 h-5 ${typeStyles.icon}`}
            />
            <span className="font-semibold text-base-content">{title}</span>
          </div>
          <p className="text-sm text-base-content/70 leading-relaxed">
            {description}
          </p>
        </label>
      </div>
    </div>
  );
};

export default CheckboxCard; 