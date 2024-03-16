import { Cell } from "./cell";

export const Calendar = () => {
  return (
    <div className="w-[400px] border-t border-l">
      <div className="grid grid-cols-7 justify-center items-center text-center">
        <Cell className="col-span-2" text={"<"} />
        <Cell className="col-span-3" text="March 2024" />
        <Cell className="col-span-2" text={">"} />
      </div>
    </div>
  );
};
