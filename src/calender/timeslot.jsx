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
          onClick={props.setAvailable}
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
