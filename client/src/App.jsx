import { Calendar } from "./pages/calender/calendar";
import { Cell } from "./pages/calender/cell";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CreateRoom } from "./pages/create-room/create-room";

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
      />
      <h1 className="font-semibold text-5xl text-center mt-2">
        when can we meet?
      </h1>
      <Router>
        <Routes>
          <Route
            path="/room/1"
            element={<Calendar value={currentDate} onChange={setCurrentDate} />}
          />
          <Route path="/" element={<CreateRoom />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
