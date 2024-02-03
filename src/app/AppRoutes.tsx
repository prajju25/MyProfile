import React from "react";
import { Route, Routes } from "react-router-dom";
import Apps from "./pages/Applications/Applications";
import Home from "./Home";
import Photography from "./pages/Photography/Photography";
import MyProfile from "./pages/Profile/MyProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route index path="/profile" element={<MyProfile />} />
      <Route path="/photography" element={<Photography />} />
      <Route path="/apps" element={<Apps />} />
    </Routes>
  );
};
export default AppRoutes;
