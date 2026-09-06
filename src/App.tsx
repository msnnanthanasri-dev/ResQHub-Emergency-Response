
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Main application */}
        <Route path="/" element={<Dashboard />} />

        <Route path="/emergencies" element={<Emergencies />} />

        <Route path="/volunteers" element={<Volunteers />} />

        <Route path="/camps" element={<ReliefCamps />} />

        <Route path="/resources" element={<Resources />} />

        <Route path="/map" element={<Map />} />

        <Route path="/alerts" element={<Alerts />} />

        <Route path="/settings" element={<Settings />} />

        {/* Unknown URL */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
