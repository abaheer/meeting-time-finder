import { stateContext } from "../../hooks/context";
import { useContext, useEffect } from "react";
import { Cell } from "./cell";
import { TimeSlots } from "./timeslot";
import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  differenceInDays,
  add,
  sub,
  set,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameWeek,
} from "date-fns";
import { Link } from "react-router-dom";

const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const Calendar = (props) => {
  const { getNumParticipants, loadDates, storeUserDates, addTimes, context } =
    useContext(stateContext);

  useEffect(() => {
    storeUserDates();
    getNumParticipants();
    loadDates();
  }, []);

  const startDate = startOfMonth(props.value);
  const startWeek = startOfWeek(props.value);
  const endDate = endOfMonth(props.value);
  const numberOfDays = differenceInDays(endDate, startDate);
  const daysArray = Array.from(Array(numberOfDays));
  const beforeCells = Array.from(Array(startDate.getDay()));
  const afterCells = Array.from(Array((7 - endDate.getDay()) % 7));

  const numWeekDays = Array.from(
    Array(
      differenceInDays(endOfWeek(props.value), startOfWeek(props.value)) + 1
    )
  );
  const datesOfTheMonth = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => {
    props.onChange((prev) => add(prev, { months: 1 }));
  };

  const prevMonth = () => {
    props.onChange((prev) => sub(prev, { months: 1 }));
  };

  const setCurrentDay = (dayOfTheMonth) => {
    props.onChange((prev) => set(prev, { date: dayOfTheMonth }));
  };

  return (
    <>
      <nav className="flex justify-center bg-sky-900 text-white font-medium p-4 text-2xl">
        <Link to="/join">
          <h1 className="ml-2 text-right float-right">Join Room</h1>
        </Link>
        <h1 className="ml-2 mr-2"> | </h1>
        <Link to="/">
          <h1 className="text-right float-right">Create Room</h1>
        </Link>
      </nav>

      <div className="mt-5 flex justify-center items-center">
        <div className="w-[500px] bg-white shadow-2xl border-none">
          <div
            key="uhhh"
            className="grid grid-cols-7 border-t border-l justify-center items-center text-center"
          >
            <Cell className="col-span-2" text={"<"} onClick={prevMonth} />
            <Cell
              className="col-span-3"
              text={
                props.value.toLocaleString("default", { month: "long" }) +
                " " +
                props.value.getFullYear()
              }
            />
            <Cell className="col-span-2" text={">"} onClick={nextMonth} />
            {daysOfTheWeek.map((day, index) => {
              return (
                <Cell
                  key={day}
                  className="col-span-1 text-sm font-bold"
                  text={day}
                  startWeek={props.value}
                  dayIndex={index}
                />
              );
            })}
            {numWeekDays.map((_, index) => {
              return (
                <TimeSlots
                  key={`TimeSlot${index}`}
                  startWeek={startOfWeek(props.value)}
                  dayIndex={index}
                />
              );
            })}
          </div>

          <div className="border-2 grid grid-cols-8 items-center justify-center">
            {/* <div className="text-xl grid grid-rows-9 justify-center leading-8 mt-7">
              <h1>9</h1>
              <h1>10</h1>
              <h1>11</h1>
              <h1>12</h1>
              <h1>1</h1>
              <h1>2</h1>
              <h1>3</h1>
              <h1>4</h1>
              <h1>5</h1>
            </div> */}
            <div className="col-start-4 col-span-2 flex justify-center">
              <button
                type="submit"
                className="transition duration-200 mt-2 mb-5 border-white border-2 rounded py-1 px-3 text-white font-bold bg-blue-500 hover:bg-blue-800"
                onClick={addTimes}
              >
                Save
              </button>
            </div>
          </div>
        </div>
        <h1>{props.value.getDate()}</h1>
      </div>
      <div className="flex-col text-center *:justify-center">
        {" "}
        <h1>person name = {context.personName}</h1>
        <h1>room name = {context.roomName}</h1>
      </div>
    </>
  );
};
