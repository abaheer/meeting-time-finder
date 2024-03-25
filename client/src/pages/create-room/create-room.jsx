import { useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import axios from "axios";
import { ENDPOINTS, createAPIEndpoint } from "../../api";

const getFreshModel = () => ({
  roomname: "",
  username: "",
  password: "",
});

export const CreateRoom = () => {
  const navigate = useNavigate();
  const { values, setValues, errors, setErrors, handleInputChange } =
    useForm(getFreshModel);

  const NewRoom = (e) => {
    e.preventDefault();
    console.log(values);

    axios
      .post("https://localhost:7118/api/Rooms", {
        room: {
          // Include the room object
          roomName: "idioata",
          password: "pass123",
          meetingStart: "9",
          meetingEnd: "17",
          timeInterval: 60,
          participants: null,
        },
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

    // axios
    //   .get("https://localhost:7118/api/Rooms/1")
    //   .then((response) => {
    //     console.log(response.data);
    //   })
    //   .catch((error) => {
    //     console.error("Error fetching data:", error);
    //   });
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="w-full max-w-xs justify-center">
        <form
          noValidate
          autoComplete="off"
          onSubmit={NewRoom}
          className="transition duration-300 bg-white hover:shadow-xl border-sky-600 border-8 rounded-3xl px-8 pt-6 pb-8 mb-4"
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
          <div className="mb-6">
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
          </div>
          <div className="flex items-center justify-center">
            <button
              className="transition duration-300 bg-sky-600 hover:bg-sky-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Create Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
