import React, { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Apps from "./pages/Applications/Applications";
import Home from "./Home";
import Photography from "./pages/Photography/Photography";
import MyProfile from "./pages/Profile/MyProfile";
import { Loading } from "./Components/StatusPanel";

// Loaded on demand so visitors never download the editor.
const Admin = lazy(() => import(/* webpackChunkName: "admin" */ "./pages/Admin/Admin"));

const AppRoutes = () => {
  return (
    <Routes>
      <Route index element={<Home />} />
      <Route path="/profile" element={<MyProfile />} />
      <Route path="/photography" element={<Photography />} />
      <Route path="/apps" element={<Apps />} />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<Loading label="Loading console" />}>
            <Admin />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
export default AppRoutes;
