import { createContext, useState } from "react";

export const stateContext = createContext();

const getFreshContext = () => {
  return {
    personId: 0,
    roomId: 0,
  };
};

export const ContextProvider = ({ children }) => {
  const [context, setContext] = useState(getFreshContext());

  const contextValue = {
    context,
    setContext,
  };

  return (
    <stateContext.Provider value={contextValue}>
      {children}
    </stateContext.Provider>
  );
};
