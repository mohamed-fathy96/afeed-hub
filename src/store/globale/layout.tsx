

import { useEffect, useMemo } from "react";

import { createHookedContext } from "@app/helpers/hooks/create-hooked-context";
import { useLocalStorage } from "@app/helpers/hooks/use-local-storage";

export type ILayoutState = {
  leftbar: {
    hide: boolean;
    type: "full" | "mobile";
  };
};

const INIT_STATE: ILayoutState = {
  leftbar: {
    hide: false,
    type: "full",
  },
};

const useHook = () => {
  const [state, setState] = useLocalStorage<ILayoutState>(
    "__NEXUS_ADMIN_LAYOUT__",
    INIT_STATE
  );

  const htmlRef = useMemo(
    () => typeof window !== "undefined" && document.querySelector("html"),
    []
  );

  const updateState = (newState: Partial<ILayoutState>) => {
    setState({ ...state, ...newState });
  };

  const updateLeftbarState = (newState: Partial<ILayoutState["leftbar"]>) => {
    updateState({ leftbar: { ...state.leftbar, ...newState } });
  };

  useEffect(() => {
    const resizeFn = () => {
      const type = window.innerWidth < 1023 ? "mobile" : "full";
      updateLeftbarState({
        type,
        hide: type == "mobile" ? true : state.leftbar.hide,
      });
    };
    if (typeof window !== "undefined") {
      window.addEventListener("resize", resizeFn);
      resizeFn();
    }

    return () => window.removeEventListener("resize", resizeFn);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (htmlRef) {
      if (state.leftbar.hide) {
        htmlRef.setAttribute("data-leftbar-hide", "");
      } else {
        htmlRef.removeAttribute("data-leftbar-hide");
      }
      htmlRef.setAttribute("data-leftbar-type", state.leftbar.type);
    }
  }, [htmlRef, state]);

  const hideLeftbar = (hide = true) => {
    updateLeftbarState({ hide });
  };
  const hideMobileLeftbar = (hide = true) => {
    if (state.leftbar.type == "mobile") updateLeftbarState({ hide });
  };

  const reset = () => {
    setState(INIT_STATE);
  };

  return {
    state,
    hideLeftbar,
    hideMobileLeftbar,
    reset,
  };
};

const [useLayoutContext, LayoutContextProvider] = createHookedContext(useHook);

export { useLayoutContext, LayoutContextProvider };
