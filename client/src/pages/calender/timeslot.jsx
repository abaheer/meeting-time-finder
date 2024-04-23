import { add, set, eachMinuteOfInterval } from "date-fns";
import { useState, useContext } from "react";
import { Slot } from "./slot";
import { stateContext } from "../../hooks/context";

export const TimeSlots = (props) => {
  const day = add(props.startWeek, { days: props.dayIndex });
  const { context, userDates } = useContext(stateContext);

  const minuteIntervals = eachMinuteOfInterval(
    {
      start: new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        context.startTime
      ),
      end: new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        context.endTime
      ),
    },
    { step: context.interval }
  );

  return (
    <div className="border-t border-l justify-center items-center text-center select-none">
      {minuteIntervals.map((date, i) => (
        <Slot key={i} date={date} />
      ))}
    </div>
  );
};
