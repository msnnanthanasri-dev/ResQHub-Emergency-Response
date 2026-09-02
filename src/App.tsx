import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Emergencies from "./pages/Emergencies";
import Volunteers from "./pages/Volunteers";
import ReliefCamps from "./pages/ReliefCamps";
import Resources from "./pages/Resources";
import Map from "./pages/Map";
import Alerts from "./pages/Alerts";
import Login from "./pages/Login";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/emergencies" element={<Emergencies />} />
        <Route path="/volunteers" element={<Volunteers />} />
        <Route path="/camps" element={<ReliefCamps />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/map" element={<Map />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;