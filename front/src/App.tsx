import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/landing-page/LandingPage";
import { routes } from "./routes";
import PrivateRoute from "./components/private-route/PrivateRoute";
import { useAppSelector } from "./redux/store";
import SignupPage from "./components/sign-up/SignupPage";
import Navbar from "./components/navbar/Navbar";
import HomePage from "./components/home-page/homePage";
import ClubPage from "./components/club-page/ClubPage";

const App = () => {
  const showNavbar = useAppSelector((state) => state.navbarReducer);

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="" element={<LandingPage />} />
        <Route path={routes.signup} element={<SignupPage />} />
        {/* Everything that's inside private route is accessible only after logging in */}
        <Route element={<PrivateRoute />}>
          <Route path={routes.home} element={<HomePage />} />
          <Route path={routes.club} element={<ClubPage />} />
        </Route>
        <Route path="*" element={<Navigate to={routes.home} />} />
      </Routes>
    </div>
  );
};

export default App;
