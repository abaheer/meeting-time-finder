import { Calendar } from "./calender/calendar";
import { Cell } from "./calender/cell";
import { useState } from "react";
function App() {
  const [currentDate, setCurrentDate] = useState(new Date("4/01/2024"));

  return (
    <div className="mt-5 flex flex-col items-center">
      <Calendar value={currentDate} onChange={setCurrentDate} />
    </div>
  );
}

export default App;
