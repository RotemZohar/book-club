import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import EditDetailsPage from "./components/edit-details/EditDetails";
import PetEditPage from "./components/edit-pet/editPetPage";
import LandingPage from "./components/landing-page/LandingPage";
import CalendarPage from "./components/calendar/CalendarPage";
import { routes } from "./routes";
import PrivateRoute from "./components/private-route/PrivateRoute";
import { useAppSelector } from "./redux/store";
import SignupPage from "./components/sign-up/SignupPage";
import CreateGroupPage from "./components/create-group/CreateGroupPage";
import AddPetForm from "./components/pets/AddPetForm";
import GroupsPage from "./components/groups-page/Groups";
import PetsPage from "./components/pets-page/Pets";
import PetDetails from "./components/pet-details/PetDetails";
import GroupDetails from "./components/group-details/GroupDetails";
import Navbar from "./components/navbar/Navbar";
import HomePage from "./components/home-page/homePage";
import PetMedicalPageGuests from "./components/pet-medical-page-guests/petMedicalPageGuests";
import GroupEditPage from "./components/edit-group/EditGroupPage";

const App = () => {
  const showNavbar = useAppSelector((state) => state.navbarReducer);

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="" element={<LandingPage />} />
        <Route path={routes.signup} element={<SignupPage />} />
        <Route
          path={routes.petMedicalGuests}
          element={<PetMedicalPageGuests />}
        />
        {/* Everything that's inside private route is accessible only after logging in */}
        <Route element={<PrivateRoute />}>
          <Route path={routes.home} element={<HomePage />} />
          <Route path={routes.createGroup} element={<CreateGroupPage />} />
          <Route path={routes.newpet} element={<AddPetForm />} />
          <Route path={routes.calendar} element={<CalendarPage />} />
          <Route path={routes.groups} element={<GroupsPage />} />
          <Route path={routes.pets} element={<PetsPage />} />
          <Route path={routes.pet} element={<PetDetails />} />
          <Route path={routes.group} element={<GroupDetails />} />
          <Route path={routes.editDetals} element={<EditDetailsPage />} />
          <Route path={routes.petEdit} element={<PetEditPage />} />
          <Route path={routes.groupEdit} element={<GroupEditPage />} />
        </Route>
        <Route path="*" element={<Navigate to={routes.home} />} />
      </Routes>
    </div>
  );
};

export default App;
