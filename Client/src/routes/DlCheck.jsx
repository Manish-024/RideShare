import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { Outlet } from "react-router-dom";
import { AuthContext } from "../context/ContextProvider";
import CreateRide from "../pages/CreateRide";
export const DlCheck = () => {
  let { isDlVerified } = useContext(AuthContext);
  isDlVerified = true;

  return isDlVerified ? (
    <CreateRide />
  ) : (
    // Redirect to Login page if accessToken is not present
    <Navigate to="/verifyDl" />
  );
};
