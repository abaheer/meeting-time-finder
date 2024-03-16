import { Cell } from "./cell";
import { startOfMonth, endOfMonth, differenceInDays, add, sub } from "date-fns";
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
  };

  return (
    <div className="w-[400px] border-t border-l">
      <div className="grid grid-cols-7 justify-center items-center text-center">
        <Cell className="col-span-2" text={"<"} onClick={prevMonth} />
        <Cell
          className="col-span-3"
          text={
            props.value.toLocaleString("default", { month: "long" }) +
            " " +
            (parseInt(props.value.getYear(), 10) + 1900)
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

        {beforeCells.map((n, index) => {
          return <Cell className="col-span-1" text={""} />;
        })}

        {daysArray.map((n, index) => {
          return <Cell className="col-span-1" text={index + 1} />;
        })}

        {afterCells.map((n, index) => {
          return <Cell className="col-span-1" text={""} />;
        })}
      </div>
    </div>
  );
};
