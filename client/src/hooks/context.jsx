import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const stateContext = createContext();

const getFreshContext = () => {
  return {
    personId: 3,
    personName: "",
    roomId: 1,
    roomName: "",
    numParticipants: -1, // number of participants in a room.
    selectedDates: new Map(), // current user selected dates.
    userDates: new Map(), // loaded dates from all users so we can display counts (date => count).
    postDates: new Array(), // dates which will be called to addTime POST method (adding/creating Person_AvailableTime entry)
    deleteDates: new Array(), // dates which will be called to DELETE POST method (removing Person_AvailableTime entry)
  };
};

export const ContextProvider = ({ children }) => {
  const [context, setContext] = useState(getFreshContext());

  const setRoom = (pId, pName, rId, rName) => {
    setContext((prev) => ({
      ...prev,
      personId: pId,
      personName: pName,
      roomId: rId,
      roomName: rName,
      numParticipants: 1,
    }));
  };

  const getNumParticipants = () => {
    axios
      .get(`https://localhost:7118/api/Rooms/${context.roomId}/Participants`)
      .then((res) => {
        console.log("getNumParticipants: ", res.data);
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

  // return the number of people available at a given time
  const peopleAtTime = (date) => {
    const keyString = date.toString();

    if (context.userDates.has(keyString)) {
      // console.log(
      //   `peopleAtTIme ${keyString}: `,
      //   context.userDates.get(keyString)
      // );
      return context.userDates.get(keyString);
    }
    return 0;
  };

  const incrementUserDate = (date, increment) => {
    setContext((prev) => {
      console.log(date, increment);
      const temp = new Map(prev.userDates);

      const oldVal = temp.get(date.toString());

      if (!isNaN(oldVal)) {
        if (increment) {
          temp.set(date.toString(), oldVal + 1);
          console.log("INCREMENT", temp);
          return { ...prev, userDates: temp };
        } else if (!increment && oldVal > 0) {
          temp.set(date.toString(), oldVal - 1);
          console.log("DECREMENT", temp);
          return { ...prev, userDates: temp };
        }
      }

      temp.set(date.toString(), 1);
      console.log("INCREMENT", temp);
      return { ...prev, userDates: temp };
    });
  };

  // store dates the user clicks in a selecedDates (date: [times])
  const selectDate = (date) => {
    setContext((prev) => {
      const newMap = new Map(prev.selectedDates);
      const day = date.toLocaleDateString("en-GB");
      const hour = date.getHours();
      const minutes = 0;

      const newPostDate =
        day +
        " " +
        hour.toString().padStart(2, "0") +
        ":" +
        minutes.toString().padStart(2, "0");

      const tempPosts = [...context.postDates];
      const tempDelPosts = [...context.deleteDates];

      const temp = new Map(prev.userDates);
      const oldVal = temp.get(date.toString());

      if (!newMap.has(day)) {
        // selecting date first time
        newMap.set(day, [hour]);
        tempPosts.push(newPostDate);
        if (!isNaN(oldVal)) {
          temp.set(date.toString(), oldVal + 1);
          console.log("INCREMENT", temp);
        } else {
          temp.set(date.toString(), 1);
        }
      } else {
        const hoursArray = newMap.get(day);
        if (!hoursArray.includes(hour)) {
          tempPosts.push(newPostDate);
          hoursArray.push(hour);
          newMap.set(day, hoursArray);
          if (!isNaN(oldVal)) {
            temp.set(date.toString(), oldVal + 1);
            console.log("INCREMENT", temp);
          } else {
            temp.set(date.toString(), 1);
          }

          return {
            ...prev,
            selectedDates: newMap,
            userDates: temp,
            postDates: tempPosts,
            deleteDates: tempDelPosts.filter(function (e) {
              return e !== newPostDate;
            }),
          };
        } else {
          tempDelPosts.push[newPostDate];
          newMap.set(
            day,
            hoursArray.filter(function (e) {
              return e !== hour;
            })
          );
          if (!isNaN(oldVal) && oldVal > 0) {
            tempDelPosts.push(newPostDate);
            temp.set(date.toString(), oldVal - 1);
            console.log("DECREMENT", temp);
            console.log("filter -> ", newPostDate, context.postDates);
            console.log("add -> ", newPostDate, context.deleteDates);
            return {
              ...prev,
              selectedDates: newMap,
              userDates: temp,
              postDates: tempPosts.filter(function (e) {
                return e !== newPostDate;
              }),
              deleteDates: tempDelPosts,
            };
          }
        }
      }

      console.log("updated postDates: ", prev.postDates);
      console.log("updated deleteDates: ", prev.deleteDates);
      console.log("updated selectedDates: ", prev.selectedDates);
      return {
        ...prev,
        selectedDates: newMap,
        userDates: temp,
        postDates: tempPosts,
      };
    });
  };

  // update db
  const addTimes = () => {
    context.postDates.forEach((e) => {
      console.log(e);
      axios.post(
        `https://localhost:7118/addTime/${context.roomId}/${
          context.personId
        }/${encodeURIComponent(e)}`
      );
    });

    context.deleteDates.forEach((e) => {
      console.log(e);
      axios.delete(
        `https://localhost:7118/api/Person_AvailableTime/${context.roomId}/${
          context.personId
        }/${encodeURIComponent(e)}`
      );
    });
  };

  // locally store dates
  const storeUserDates = async () => {
    const dates = await getUserDates(); // Wait for getUserDates to complete

    dates.forEach((ndate) => {
      const date = new Date(ndate.time);
      setContext((prev) => {
        const newMap = new Map(prev.selectedDates);
        const day = date.toLocaleDateString("en-GB");
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
        console.log("storeUesrDates");
        return { ...prev, selectedDates: newMap }; // Return the new Map instance
      });
    });
  };

  const getUserDates = () => {
    return axios
      .get(`https://localhost:7118/api/People/${context.personId}/GetTimes`)
      .then((res) => {
        return res.data;
      });
  };

  const isSelected = (date) => {
    const day = date.toLocaleDateString("en-GB");
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
    setRoom,
    getNumParticipants,
    selectDate,
    loadDates,
    peopleAtTime,
    storeUserDates,
    isSelected,
    incrementUserDate,
    addTimes,
  };

  return (
    <stateContext.Provider value={contextValue}>
      {children}
    </stateContext.Provider>
  );
};
