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
  eachWeekOfInterval,
  eachHourOfInterval,
} from "date-fns";
import { useState } from "react";
import { Slot } from "./slot";

export const TimeSlots = (props) => {
  const day = add(props.startWeek, { days: props.dayIndex });

  const hourIntervals = eachHourOfInterval({
    start: new Date(2014, 9, 6, 9),
    end: new Date(2014, 9, 6, 17),
  });

  const [freeHours, setFreeHours] = useState(new Map());

  const setAvailable = (date) => {
    setFreeHours((prev) => {
      const newMap = prev; // Create a shallow copy of the previous map
      const day = date.toLocaleDateString("en-US");
      const hour = date.getHours();

      if (!newMap.has(day)) {
        newMap.set(day, [date]);
      } else {
        // If the key exists, check if the hour is already in the array
        const hoursArray = newMap.get(day);
        if (!hoursArray.includes(hour)) {
          // If the hour doesn't exist, add it to the array
          hoursArray.push(hour);
          newMap.set(day, hoursArray); // Update the value for the key
        } else {
          const hoursArray = newMap.get(day);
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
    <div className="flex flex-col items-center justify-center">
      <h1 className="w-14 mt-2 flex justify-center font-bold text-xl">
        {day.getDate()}
      </h1>
      {hourIntervals.map((date, i) => (
        <Slot
          key={i}
          date={set(date, {
            year: day.getFullYear(),
            month: day.getMonth(),
            date: day.getDate(),
          })}
          onClick={setAvailable}
          savedDate={
            (
              hourIntervals.find((item) => {
                return item == date;
              }) || []
            ).length > 0
          }
        />
      ))}
    </div>
  );
};
