import moonIcon from "@iconify/icons-lucide/moon";
import sunIcon from "@iconify/icons-lucide/sun";

import { Icon } from "@app/ui/Icon";
import { Button, ButtonProps } from "@app/ui/Button";
import { useGlobalContext } from "@app/store/globale/global";

const ThemeToggleButton = (props: ButtonProps) => {
  const { state, changeThemeMode } = useGlobalContext();
  return (
    <Button
      {...props}
      onClick={() =>
        changeThemeMode(state?.theme?.mode == "dark" ? "light" : "dark")
      }
      aria-label="Theme toggler"
    >
      {state?.theme?.mode == "dark" && <Icon icon={sunIcon} fontSize={20} />}
      {state?.theme?.mode == "light" && <Icon icon={moonIcon} fontSize={20} />}
    </Button>
  );
};

export { ThemeToggleButton };
