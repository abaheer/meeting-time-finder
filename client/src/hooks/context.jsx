import axios from "axios";
import { createContext, useState } from "react";

export const stateContext = createContext();

const getFreshContext = () => {
  return {
    personId: 0,
    roomId: 0,
    numParticipants: -1,
  };
};

export const ContextProvider = ({ children }) => {
  const [context, setContext] = useState(getFreshContext());

  const getNumParticipants = () => {
    axios.get("https://localhost:7118/api/Rooms/1/Participants").then((res) => {
      console.log(res.data.$values.length);
      setContext((prev) => ({
        ...prev,
        numParticipants: res.data.$values.length,
      }));
    });
  };

  const contextValue = {
    context,
    setContext,
    getNumParticipants,
  };

  return (
    <stateContext.Provider value={contextValue}>
      {children}
    </stateContext.Provider>
  );
};
