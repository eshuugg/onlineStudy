import { combineReducers } from "@reduxjs/toolkit";
import loginReducer from "../redux/Slicers/loginSlicer";
// import Dashboard from "../screens/Dashboard/Dashboard";

const rootReducer = combineReducers({
  loginData: loginReducer,
  // DashboardData: Dashboard,
});

export default rootReducer;