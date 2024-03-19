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

export const TimeSlots = (props) => {
  const day = add(props.startWeek, { days: props.dayIndex });

  const hourIntervals = eachHourOfInterval({
    start: new Date(2014, 9, 6, 9),
    end: new Date(2014, 9, 6, 17),
  });

  console.log(hourIntervals);
  return (
    <div className="flex flex-col items-center justify center">
      <h1 className="w-14 mt-2 flex justify-center font-bold text-xl">
        {day.getDate()}
      </h1>
      {hourIntervals.map((date, i) => {
        return (
          <div className="text-black bg-red-400 mb-2 w-12 rounded font-bold text-center">
            {date.getHours() % 12 ? (date.getHours() % 12) + "am" : 12 + "pm"}
          </div>
        );
      })}
    </div>
  );
};
