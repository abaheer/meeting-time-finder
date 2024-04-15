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
    <div className="border-t border-l justify-center items-center text-center select-none">
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
