import axios from "axios";
import { createContext, useState } from "react";

export const stateContext = createContext();

const getFreshContext = () => {
  return {
    personId: 0,
    roomId: 0,
    numParticipants: -1,
    selectedDates: new Map(),
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

  const selectDate = (date) => {
    setContext((prev) => {
      const newMap = new Map(prev.selectedDates);
      const day = date.toLocaleDateString("en-US");
      const hour = date.getHours();

      if (!newMap.has(day)) {
        newMap.set(day, [hour]);
      } else {
        const hoursArray = newMap.get(day);
        if (!hoursArray.includes(hour)) {
          hoursArray.push(hour);
          newMap.set(day, hoursArray);
        } else {
          newMap.set(
            day,
            hoursArray.filter(function (e) {
              return e !== hour;
            })
          );
        }
      }

      console.log(newMap);
      return { ...prev, selectedDates: newMap }; // Return the new Map instance
    });
  };
  const contextValue = {
    context,
    setContext,
    getNumParticipants,
    selectDate,
  };

  return (
    <stateContext.Provider value={contextValue}>
      {children}
    </stateContext.Provider>
  );
};
