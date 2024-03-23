import { useState } from "react";

export const Slot = ({ date, onClick, savedDate }) => {
  const [isSelected, setIsSelected] = useState(savedDate);

  const handleOnClick = () => {
    setIsSelected((prev) => !prev);
    onClick(date); // Call the onClick handler passed from parent with the date
  };

  return (
    <div
      onClick={handleOnClick}
      className={`transition text-black ${
        isSelected ? `bg-green-400` : `bg-red-400`
      } transition-duration:150ms cursor-pointer mb-2 w-12 rounded font-bold text-center`}
    >
      {date.getHours() % 12 ? (date.getHours() % 12) + "am" : 12 + "pm"}
    </div>
  );
};
