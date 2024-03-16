import clsx from "clsx";

export const Cell = (props) => {
  return (
    <div
      className={clsx(
        "h-12 flex text-center items-center justify-center border-b border-r",
        props.className
      )}
    >
      {props.text}
    </div>
  );
};
