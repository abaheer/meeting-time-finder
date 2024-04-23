import { Link, useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import axios from "axios";
import { stateContext } from "../../hooks/context";
import { useContext } from "react";
import Slider from "rc-slider";
import Tooltip from "rc-tooltip";
import "rc-slider/assets/index.css";

const { Handle } = Slider;

const wrapperStyle = { width: 400, margin: 50 };

const handleRender = (renderProps) => {
  const { value, dragging, index, ...restProps } = renderProps.props;
  return <Handle value={value} {...restProps} />;
};

const getFreshModel = () => ({
  roomname: "",
  username: "",
  password: "",
  interval: 60,
  times: [9, 17],
});

export const CreateRoom = () => {
  const navigate = useNavigate();
  const {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    handleSliderChange,
  } = useForm(getFreshModel);

  const { setRoom, formatTime } = useContext(stateContext);

  const NewRoom = (e) => {
    e.preventDefault();
    console.log(values);

    axios
      .post(`https://localhost:7118/api/Rooms/${values.username}/`, {
        roomName: `${values.roomname}`,
        password: `${values.password}`,
        meetingStart: `${values.times[0]}`,
        meetingEnd: `${values.times[1]}`,
        timeInterval: `${values.interval}`,
      })
      .then(function (response) {
        console.log(response);
        setRoom(
          response.data.participants[0].personId,
          response.data.participants[0].personName,
          response.data.roomId,
          response.data.roomName,
          response.data.meetingStart,
          response.data.meetingEnd,
          response.data.timeInterval
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
          className="bg-white border-4 border-black rounded-md px-8 pt-6 pb-8 mb-4"
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
              htmlFor="username"
            >
              Room Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="roomname"
              type="text"
              placeholder="Project Meeting Schedule"
              value={values.roomname}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="interval"
            >
              Time Interval
            </label>
            <select
              id="interval"
              name="interval"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              onChange={handleInputChange}
            >
              {/* <option defaultValue={60}>Select an Interval</option> */}
              <option value={60}>60 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={10}>10 Minutes</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="times"
            >
              Meeting Times
            </label>
            <Slider
              range
              allowCross={false}
              step={1} // lets do hour steps but allow the user to change the interval as desired
              // step={values.interval / 60}
              name="times"
              min={0}
              max={24}
              defaultValue={[9, 17]}
              handle={handleRender}
              onChange={(newValue) => handleSliderChange("times", newValue)}
            />
            <p>
              {formatTime(values.times[0])} to {formatTime(values.times[1])}
            </p>
            <input
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="start"
              type="text"
              placeholder="9"
              value={values.times[0]}
              onChange={handleInputChange}
            />
            <input
              className="shadow appearance-none border rounded w-1/2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="start"
              type="text"
              placeholder="17"
              value={values.times[1]}
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
              className="transition duration-300 bg-sky-600 hover:bg-sky-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
              type="submit"
            >
              Create Room
            </button>
          </div>
          <Link to="/join" className="flex justify-center mt-2 underline">
            Or Join an existing room
          </Link>
        </form>
      </div>
    </div>
  );
};
