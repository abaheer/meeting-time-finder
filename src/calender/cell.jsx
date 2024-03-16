import clsx from "clsx";

export const Cell = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={clsx(
        "bg-white text-black h-14 flex text-center items-center justify-center border-trueGray-800 border-b border-r select-none",
        {
          "cursor-pointer hover:border-2 hover:border-blue-600 transition-colors duration-200":
            props.onClick,
        },
        props.className,
        props.dayOfTheMonth
      )}
    >
      {props.text}
    </div>
  );
};
