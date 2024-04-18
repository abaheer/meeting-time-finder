import clsx from "clsx";
import { add } from "date-fns";

export const Cell = (props) => {
  const day =
    props.startWeek && props.dayIndex
      ? add(props.startWeek, { days: props.dayIndex })
      : props.startWeek;

  return (
    <div
      onClick={props.onClick}
      key={`cell${props.text}`}
      className={clsx(
        "bg-white text-black h-14 flex text-center items-center justify-center border-trueGray-800 border-b border-r select-none",
        {
          "cursor-pointer hover:border-2 hover:border-black transition-colors duration-200":
            props.onClick,
        },
        props.className,
        props.dayOfTheMonth
      )}
    >
      <h1>{props.text} </h1>
      <h2 className="font-bold">{day && day.getDate()}</h2>
    </div>
  );
};
