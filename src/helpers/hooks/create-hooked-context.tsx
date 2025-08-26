import { ReactNode, createContext, useContext } from "react";

const createHookedContext = <T, E>(fn: (props: E) => T) => {
  type HookReturnType = ReturnType<typeof fn>;

  const Context = createContext({} as HookReturnType);

  const ContextProvider = ({
    children,
    ...other
  }: { children: ReactNode } & E) => {
    // @ts-expect-error: Type of 'other' is not known at this point
    return <Context.Provider value={fn(other)}>{children}</Context.Provider>;
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const hook = () => useContext(Context);

  return [hook, ContextProvider] as const;
};

export { createHookedContext };
