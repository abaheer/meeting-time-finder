import axios from "axios";
import { createContext, useState } from "react";

export const stateContext = createContext();

const getFreshContext = () => {
  return {
    personId: 3,
    roomId: 1,
    numParticipants: -1, // number of participants in a room.
    selectedDates: new Map(), // current user selected dates.
    userDates: new Map(), // loaded dates from all users so we can display counts (date => count).
  };
};

export const ContextProvider = ({ children }) => {
  const [context, setContext] = useState(getFreshContext());

  const getNumParticipants = () => {
    axios
      .get(`https://localhost:7118/api/Rooms/${context.roomId}/Participants`)
      .then((res) => {
        console.log(res.data);
        setContext((prev) => ({
          ...prev,
          numParticipants: res.data.length,
        }));
      });
  };

  // set UserDates to store all times with at least one person available
  const loadDates = () => {
    axios
      .get(
        `https://localhost:7118/api/Rooms/${context.roomId}/Participants/AvailableTimes/Counts`
      )
      .then((res) => {
        const temp = new Map();
        res.data.forEach((element) => {
          const toDate = new Date(element.time);
          temp.set(toDate.toString(), element.count);
        });
        console.log(temp);
        setContext((prev) => {
          return { ...prev, userDates: temp };
        });
      });
  };

  const incrementUserDate = (date) => {
    setContext((prev) => {
      const temp = new Map(prev.userDates);

      const oldVal = temp.get(date.toString());

      if (!isNaN(oldVal)) {
        temp.set(date.toString(), oldVal + 1);
        console.log("baaa", temp);
        return { ...prev, userDates: temp };
      }

      temp.set(date.toString(), 1);
      console.log("mbaaa", temp);
      return { ...prev, userDates: temp };
    });
  };

  // return the number of people available at a given time
  const peopleAtTime = (date) => {
    const keyString = date.toString();

    if (context.userDates.has(keyString)) {
      return context.userDates.get(keyString);
    }
    return 0;
  };

  // store dates the user clicks in a selecedDates (date: [times])
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

      console.log("hey", newMap);
      return { ...prev, selectedDates: newMap }; // Return the new Map instance
    });

    incrementUserDate(date);
  };

  const getUserDates = () => {
    return axios
      .get(`https://localhost:7118/api/People/${context.personId}/GetTimes`)
      .then((res) => {
        return res.data;
      });
  };

  const storeUserDates = async () => {
    const dates = await getUserDates(); // Wait for getUserDates to complete

    dates.forEach((ndate) => {
      const date = new Date(ndate.time);
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
          }
        }
        return { ...prev, selectedDates: newMap }; // Return the new Map instance
      });
    });
    console.log("heyyyy", context.selectedDates);
  };

  const isSelected = (date) => {
    const day = date.toLocaleDateString("en-US");
    const hour = date.getHours();

    if (!context.selectedDates.has(day)) {
      return false;
    } else {
      const hours = context.selectedDates.get(day);
      if (hours.includes(hour)) {
        return true;
      }
    }
    return false;
  };

  const contextValue = {
    context,
    setContext,
    getNumParticipants,
    selectDate,
    loadDates,
    peopleAtTime,
    storeUserDates,
    isSelected,
    incrementUserDate,
  };

  return (
    <stateContext.Provider value={contextValue}>
      {children}
    </stateContext.Provider>
  );
};
