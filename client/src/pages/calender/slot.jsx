import { useState } from "react";
import { stateContext } from "../../hooks/context";
import { useContext, useEffect } from "react";

export const Slot = ({ date, onClick, savedDate }) => {
  const [isSelected, setIsSelected] = useState(savedDate);

  const { context, selectDate } = useContext(stateContext);

  const handleOnClick = async () => {
    await selectDate(date);
    setIsSelected((prev) => !prev);
  };

  return (
    <div
      onClick={handleOnClick}
      className={`transition text-black ${
        isSelected ? `bg-green-400` : `bg-red-400`
      } transition-duration:150ms cursor-pointer mb-2 w-12 rounded font-bold text-center`}
    >
      {`0/${context.numParticipants}`}
    </div>
  );
};
