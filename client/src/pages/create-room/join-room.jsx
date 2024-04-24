import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import axios from "axios";
import { stateContext } from "../../hooks/context";
import { useContext } from "react";

const getFreshModel = () => ({
  roomid: "",
  username: "",
  password: "",
});

export const JoinRoom = () => {
  const navigate = useNavigate();
  const { values, setValues, errors, setErrors, handleInputChange } =
    useForm(getFreshModel);

  const { setRoom } = useContext(stateContext);

  const NewRoom = (e) => {
    e.preventDefault();
    console.log(values);

    axios
      .post(
        `https://localhost:7118/api/Rooms/Person/${values.roomid}/${values.username}`
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
        navigate("/room");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="w-full max-w-xs justify-center">
        <form
          noValidate
          autoComplete="off"
          onSubmit={NewRoom}
          className="bg-white border-black border-4 rounded-md px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="username"
              type="text"
              placeholder="Username"
              value={values.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="roomid"
            >
              Room Code
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="roomid"
              type="number"
              placeholder="12345"
              value={values.roomid}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Room Password (optional)
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              name="password"
              type="password"
              placeholder="******************"
              value={values.password}
              onChange={handleInputChange}
            />
          </div> */}
          <div className="flex items-center justify-center">
            <button
              className="mt-2 transition duration-300 bg-sky-600 hover:bg-sky-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Join Room
            </button>
          </div>
          <Link to="/create" className="mt-2 underline flex justify-center">
            Or Create a room
          </Link>
        </form>
      </div>
    </div>
  );
};
