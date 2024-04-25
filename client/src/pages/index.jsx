import { useNavigate } from "react-router-dom";

export const Index = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create");
  };

  return (
    <section className="flex items-center justify-center w-screen h-screen bg-blue-300">
      <div className="text-center ">
        <h1 className="text-6xl font-bold text-white xl:text-7xl">
          set a meeting in seconds ...
        </h1>
        {/* <h2 className="text-xl text-white">Join or create a room to begin!</h2> */}
        <button
          type="button"
          onClick={() => navigate("/create")}
          className="transition duration-200 mt-6 pl-8 pr-8 mb-5 rounded py-1 px-3 text-white font-bold bg-blue-600 hover:bg-blue-800"
        >
          Create
        </button>
        <button
          type="button"
          onClick={() => navigate("/join")}
          className="transition duration-200 mt-6 pl-8 ml-4 pr-8 mb-5 rounded py-1 px-3 text-white font-bold bg-blue-600 hover:bg-blue-800"
        >
          Join
        </button>
      </div>
    </section>
  );
};
