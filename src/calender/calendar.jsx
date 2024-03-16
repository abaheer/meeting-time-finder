import { Cell } from "./cell";

export const Calendar = () => {
  const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-[400px] border-t border-l">
      <div className="grid grid-cols-7 justify-center items-center text-center">
        <Cell className="col-span-2" text={"<"} />
        <Cell className="col-span-3" text="March 2024" />
        <Cell className="col-span-2" text={">"} />
        {daysOfTheWeek.map((day) => {
          return <Cell className="col-span-1" text={day} />;
        })}
      </div>
    </div>
  );
};
