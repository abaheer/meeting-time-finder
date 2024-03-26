import { stateContext } from "../../hooks/context";
import { useContext, useEffect } from "react";
import { Cell } from "./cell";
import { TimeSlots } from "./timeslot";
import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  differenceInDays,
  add,
  sub,
  set,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameWeek,
} from "date-fns";

const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const Calendar = (props) => {
  const { getNumParticipants } = useContext(stateContext);

  const startDate = startOfMonth(props.value);
  const startWeek = startOfWeek(props.value);
  const endDate = endOfMonth(props.value);
  const numberOfDays = differenceInDays(endDate, startDate);
  const daysArray = Array.from(Array(numberOfDays));
  const beforeCells = Array.from(Array(startDate.getDay()));
  const afterCells = Array.from(Array((7 - endDate.getDay()) % 7));

  const numWeekDays = Array.from(
    Array(
      differenceInDays(endOfWeek(props.value), startOfWeek(props.value)) + 1
    )
  );
  const datesOfTheMonth = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  useEffect(() => {
    getNumParticipants();
  }, []);

  const nextMonth = () => {
    props.onChange((prev) => add(prev, { months: 1 }));
  };

  const prevMonth = () => {
    props.onChange((prev) => sub(prev, { months: 1 }));
  };

  const setCurrentDay = (dayOfTheMonth) => {
    props.onChange((prev) => set(prev, { date: dayOfTheMonth }));
  };

  const [freeHours, setFreeHours] = useState(new Map());

  const setAvailable = (date) => {
    setFreeHours((prev) => {
      const newMap = prev; // Create a shallow copy of the previous map
      const day = date.toLocaleDateString("en-US");
      const hour = date.getHours();

      if (!newMap.has(day)) {
        newMap.set(day, [hour]);
      } else {
        // If the key exists, check if the hour is already in the array
        const hoursArray = newMap.get(day);
        if (!hoursArray.includes(hour)) {
          // If the hour doesn't exist, add it to the array
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
      return newMap; // Return the new Map instance
    });
  };

  return (
    <div className="mt-5 flex flex-wrap justify-center items-center">
      <div className="w-[500px] bg-white shadow-2xl border-none">
        <div
          key="uhhh"
          className="grid grid-cols-7 border-t border-l justify-center items-center text-center"
        >
          <Cell className="col-span-2" text={"<"} onClick={prevMonth} />
          <Cell
            className="col-span-3"
            text={
              props.value.toLocaleString("default", { month: "long" }) +
              " " +
              props.value.getFullYear()
            }
          />
          <Cell className="col-span-2" text={">"} onClick={nextMonth} />
          {daysOfTheWeek.map((day) => {
            return (
              <Cell
                key={day}
                className="col-span-1 text-sm font-bold"
                text={day}
              />
            );
          })}

          {beforeCells.map((_, index) => {
            return (
              <Cell key={`before${index}`} className="col-span-1" text={""} />
            );
          })}

          {daysArray.map((_, dayOfTheMonth) => {
            return (
              <Cell
                key={`after${dayOfTheMonth}`}
                className={
                  "col-span-1 " +
                  (props.value &&
                  isSameWeek(datesOfTheMonth[dayOfTheMonth], props.value)
                    ? " bg-blue-600 text-white"
                    : "")
                }
                text={datesOfTheMonth[dayOfTheMonth].getDate()}
                onClick={() => {
                  setCurrentDay(dayOfTheMonth + 1);
                }}
              />
            );
          })}

          {afterCells.map((_, index) => {
            return (
              <Cell key={`after${index}`} className="col-span-1" text={""} />
            );
          })}
        </div>
      </div>
      <h1>{props.value.getDate()}</h1>

      <div className="items-center flex justify-center">
        {numWeekDays.map((_, index) => {
          return (
            <TimeSlots
              key={`TimeSlot${index}`}
              startWeek={startOfWeek(props.value)}
              dayIndex={index}
              setAvailable={setAvailable}
            />
          );
        })}
        <button className="mt-2 mb-5 border-white border-2 rounded py-1 px-3 text-white font-bold hover:bg-green-800 flex justify-center items-center">
          Save
        </button>
      </div>
    </div>
  );
};
