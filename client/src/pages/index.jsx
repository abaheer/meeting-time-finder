import { useNavigate } from "react-router-dom";

export const Index = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/create");
  };

  return (
    <section className="flex items-center justify-center w-screen h-screen bg-blue-300">
      <div>
        <h1 className=" text-6xl font-bold text-white">
          set a meeting in seconds
        </h1>
        <h2 className="text-l font-semibold text-white">
          Join or create a room to begin!
        </h2>
        <button
          type="button"
          onClick={handleClick}
          className="transition duration-200 mt-4 pl-5 pr-5 mb-5 rounded py-1 px-3 text-white font-bold bg-blue-600 hover:bg-blue-800"
        >
          Go
        </button>
      </div>
    </section>
  );
};
