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
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const Calendar = (props) => {
  const {
    getNumParticipants,
    loadDates,
    storeUserDates,
    addTimes,
    context,
    formatTime,
    setRoom,
  } = useContext(stateContext);

  const [render, setRender] = useState(0);

  const navigate = useNavigate();

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

  const prevWeek = () => {
    props.onChange((prev) => sub(prev, { weeks: 1 }));
  };

  const nextWeek = () => {
    props.onChange((prev) => add(prev, { weeks: 1 }));
  };

  const setCurrentDay = (dayOfTheMonth) => {
    props.onChange((prev) => set(prev, { date: dayOfTheMonth }));
  };

  const handleInputChange = (e) => {
    console.log(context.userDetails);
    console.log("AAAAAAAA", e.target.value);

    axios
      .post(
        `https://localhost:7118/api/Rooms/Person/${context.roomId}/${e.target.value}`
      ) //return person object
      .then(function (response) {
        console.log(response);
        setRoom(
          response.data.personId,
          response.data.personName,
          response.data.room.roomId,
          response.data.room.roomName,
          response.data.room.meetingStart,
          response.data.room.meetingEnd,
          response.data.room.timeInterval
        );
      })
      .catch(function (error) {
        console.log(error);
      });
    // storeUserDates();
    // getNumParticipants();
    // loadDates();
    location.reload();
  };

  return (
    <div className="h-screen flex flex-col items-center">
      <nav className="text-white font-medium p-2 text-2xl w-[600px]">
        <Link to="/">
          <h1 className="text-right float-left">whenwefree</h1>
        </Link>
        <Link to="/">
          <h1 className="text-right float-right">{`<`}</h1>
        </Link>
      </nav>

      <div className="flex items-center justify-center mt-4">
        <select
          value={context.personName}
          id="interval"
          name="interval"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[600px] p-2.5"
          onChange={handleInputChange}
        >
          {context.userDetails.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>

      <div className="pt-2 flex justify-center items-center">
        <div className="w-[600px] bg-white shadow-sm border-none">
          <div
            key="uhhh"
            className="grid grid-cols-8 border-t border-l justify-center items-center text-center"
          >
            {/* <Cell className="col-span-1" text={""} onClick={prevMonth} /> */}
            <Cell className="col-span-1" text={"<<"} onClick={prevMonth} />
            <Cell className="col-span-1" text={"<"} onClick={prevWeek} />
            <Cell
              className="col-span-4"
              text={
                props.value.toLocaleString("default", { month: "long" }) +
                " " +
                props.value.getFullYear()
              }
            />
            <Cell className="col-span-1" text={">"} onClick={nextWeek} />
            <Cell className="col-span-1" text={">>"} onClick={nextMonth} />
            <Cell className="col-span-1" text={""} />
            {daysOfTheWeek.map((day, index) => {
              return (
                <Cell
                  key={day}
                  className="col-span-1 grid grid-rows-2 h-10 text-l"
                  text={day}
                  startWeek={startWeek}
                  dayIndex={index}
                />
              );
            })}

            <div className="text-l">
              {[
                ...Array(
                  (context.endTime - context.startTime) *
                    (60 / context.interval) +
                    1
                ),
              ].map((_, index) => {
                // console.log(index);
                const time =
                  Number(context.startTime) + (index * context.interval) / 60;
                const amOrPm = time >= 12 ? "pm" : "am";

                const twelveHourTime = time % 12 ? time % 12 : 12;
                return (
                  <Cell
                    key={index}
                    className="col-span-1 h-12"
                    text={formatTime(twelveHourTime) + amOrPm}
                  />
                );
              })}
              {/* <Cell className="col-span-1 h-12" text={"9am"} />
              <Cell className="col-span-1 h-12" text={"10am"} />
              <Cell className="col-span-1 h-12" text={"11am"} />
              <Cell className="col-span-1 h-12" text={"12pm"} />
              <Cell className="col-span-1 h-12" text={"1pm"} />
              <Cell className="col-span-1 h-12" text={"2pm"} />
              <Cell className="col-span-1 h-12" text={"3pm"} />
              <Cell className="col-span-1 h-12" text={"4pm"} />
              <Cell className="col-span-1 h-12" text={"5pm"} /> */}
            </div>
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
            <div className="col-span-8 flex justify-center">
              <button
                type="submit"
                className="transition duration-200 mt-2 mb-5 border-white border-2 rounded py-1 px-3 text-white font-bold bg-blue-600 hover:bg-blue-800"
                onClick={addTimes}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-col text-center justify-center mt-5">
        {" "}
        <h1>room name = {context.roomName}</h1>
        <h1>room id = {context.roomId}</h1>
      </div>
    </div>
  );
};
