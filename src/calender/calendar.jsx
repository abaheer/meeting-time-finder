import { Cell } from "./cell";
import {
  startOfMonth,
  endOfMonth,
  differenceInDays,
  add,
  sub,
  set,
} from "date-fns";
const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export const Calendar = (props) => {
  const startDate = startOfMonth(props.value);
  const endDate = endOfMonth(props.value);
  const numberOfDays = differenceInDays(endDate, startDate);
  const daysArray = Array.from(Array(numberOfDays));
  const beforeCells = Array.from(Array(startDate.getDay()));
  const afterCells = Array.from(Array((7 - endDate.getDay()) % 7));

  const nextMonth = () => {
    props.onChange((prev) => add(prev, { months: 1 }));
  };

  const prevMonth = () => {
    props.onChange((prev) => sub(prev, { months: 1 }));
    console.log(props.value);
  };

  const setCurrentDay = (dayOfTheMonth) => {
    props.onChange((prev) => set(prev, { date: dayOfTheMonth }));
  };

  return (
    <div className="mt-5 flex flex-col items-center">
      <div className="w-[500px] bg-white p-2 rounded-xl shadow-2xl border-none">
        <div className="grid grid-cols-7 border-t border-l justify-center items-center text-center">
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
            return <Cell className="col-span-1" text={""} />;
          })}

          {daysArray.map((_, dayOfTheMonth) => {
            return (
              <Cell
                className={
                  "col-span-1 " +
                  (props.value.getDate() === dayOfTheMonth + 1
                    ? "bg-blue-500 text-white"
                    : "")
                }
                text={dayOfTheMonth + 1}
                onClick={() => {
                  setCurrentDay(dayOfTheMonth + 1);
                }}
              />
            );
          })}

          {afterCells.map((_, index) => {
            return <Cell className="col-span-1" text={""} />;
          })}
        </div>
      </div>
      <h1>{props.value.getDate()}</h1>
    </div>
  );
};
