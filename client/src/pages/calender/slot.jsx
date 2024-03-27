import { useState } from "react";
import { stateContext } from "../../hooks/context";
import { useContext, useEffect } from "react";

export const Slot = ({ date }) => {
  const { context, selectDate, isSlotAvailable } = useContext(stateContext);
  const [text, setText] = useState(0);

  useEffect(() => {
    // Update text when isSlotAvailable changes
    setText(isSlotAvailable(date));
  }, [isSlotAvailable]); // Run the effect whenever date or isSlotAvailable changes

  const handleOnClick = async () => {
    await selectDate(date);
  };

  return (
    <div
      onClick={handleOnClick}
      className={`transition text-black ${
        text > 0 ? `bg-green-400` : `bg-red-400`
      } transition-duration:150ms cursor-pointer mb-2 w-12 rounded font-bold text-center`}
    >
      {`${text}/${context.numParticipants}`}
    </div>
  );
};
