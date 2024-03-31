import { add, set, eachHourOfInterval } from "date-fns";
import { useState, useContext } from "react";
import { Slot } from "./slot";
import { stateContext } from "../../hooks/context";

export const TimeSlots = (props) => {
  const day = add(props.startWeek, { days: props.dayIndex });
  const { context, userDates } = useContext(stateContext);

  const hourIntervals = eachHourOfInterval({
    start: new Date(2014, 9, 6, 9),
    end: new Date(2014, 9, 6, 17),
  });

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
        />
      ))}
    </div>
  );
};
