import { useState } from "react";
import { stateContext } from "../../hooks/context";
import { useContext, useEffect } from "react";

export const Slot = ({ date }) => {
  const {
    context,
    selectDate,
    peopleAtTime,
    storeUserDates,
    isSelected,
    incrementUserDate,
  } = useContext(stateContext);
  const [text, setText] = useState(0);

  useEffect(() => {
    // Update text when isSlotAvailable changes
    setText(peopleAtTime(date));
  }, [peopleAtTime]); // Run the effect whenever date or isSlotAvailable changes

  const handleOnClick = async () => {
    await selectDate(date);
  };

  return (
    <div
      onClick={handleOnClick}
      className={`transition text-black ${
        text > 0 && isSelected(date) ? `bg-green-400` : `bg-red-400`
      } flex items-center justify-center h-14 border-b transition-duration:150ms cursor-pointer font-bold text-center`}
    >
      {`${text}/${context.numParticipants}`}
    </div>
  );
};
