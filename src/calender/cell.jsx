import clsx from "clsx";

export const Cell = (props) => {
  return (
    <div
      onClick={props.onClick}
      className={clsx(
        "h-12 flex text-center items-center justify-center border-b border-r select-none",
        {
          "cursor-pointer hover:bg-gray-800 transition-colors duration-200":
            props.onClick,
        },
        props.className
      )}
    >
      {props.text}
    </div>
  );
};
