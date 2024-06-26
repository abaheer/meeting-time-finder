import { Calendar } from "./pages/calender/calendar";
import { Cell } from "./pages/calender/cell";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { CreateRoom } from "./pages/create-room/create-room";
import { JoinRoom } from "./pages/create-room/join-room";
import { ContextProvider } from "./hooks/context";
import { Index } from "./pages/index";

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <ContextProvider>
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"
      />
      {/* <h1 className="font-semibold text-5xl text-center mt-2">
        when can we meet?
      </h1> */}
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/room"
            element={<Calendar value={currentDate} onChange={setCurrentDate} />}
          />
          <Route path="/create" element={<CreateRoom />} />
          <Route path="/join" element={<JoinRoom />} />
        </Routes>
      </Router>
    </ContextProvider>
  );
}

export default App;
