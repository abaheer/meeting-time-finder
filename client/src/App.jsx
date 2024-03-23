import { Calendar } from "./calender/calendar";
import { Cell } from "./calender/cell";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
            path="/"
            element={<Calendar value={currentDate} onChange={setCurrentDate} />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
