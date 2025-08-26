import { useEffect, useMemo, useState } from "react";

import { useTheme as daisyUseTheme } from "@app/ui";
import { createHookedContext } from "@app/helpers/hooks/create-hooked-context";
import { IGlobalState } from "@app/lib/types/global";
import { getDynamicColors } from "@app/assets/theme";
import LocalStorageManager from "@app/localStore/LocalStorageManger";
import { LocalStorageKeys } from "@app/lib/helpers/constants/helpers";

const defaultState: IGlobalState = {
  theme: {
    mode: "light",
    primary: "default",
  },
};

type IPrimaryColor = keyof typeof getDynamicColors;

export const useHook = () => {
  const { setTheme } = daisyUseTheme();

  // Retrieve initial state from localStorage or fallback to defaultState
  const [state, setState] = useState(() => {
    const storedTheme = LocalStorageManager.getItem(LocalStorageKeys.THEME);
    return storedTheme ? JSON.parse(storedTheme) : defaultState;
  });

  const updateState = (changes: Partial<IGlobalState>) => {
    const updatedState = { ...state, ...changes };
    setState(updatedState);
    LocalStorageManager.setItem(
      LocalStorageKeys.THEME,
      JSON.stringify(updatedState)
    );
  };

  const isDark = useMemo(() => state.theme.mode === "dark", [state.theme.mode]);

  const htmlRef = useMemo(() => {
    return typeof window !== "undefined"
      ? document.querySelector("html")
      : null;
  }, []);

  const primaryColor = useMemo(() => {
    const primary = state.theme.primary as IPrimaryColor;
    return getDynamicColors?.[primary];
  }, [state.theme.primary]);

  useEffect(() => {
    setTheme(state.theme.mode);
    if (htmlRef) {
      if (state.theme.mode === "dark") {
        htmlRef.classList.add("dark");
      } else {
        htmlRef.classList.remove("dark");
      }
    }
  }, [state.theme.mode, htmlRef, setTheme]);

  const changeThemeMode = (themeMode: IGlobalState["theme"]["mode"]) => {
    console.log("changeThemeMode", themeMode);
    updateState({
      theme: {
        ...state.theme,
        mode: themeMode,
      },
    });
  };

  return {
    state,
    isDark,
    primaryColor,
    changeThemeMode,
  };
};

const [useGlobalContext, GlobalContextProvider] = createHookedContext(useHook);

export { useGlobalContext, GlobalContextProvider };
