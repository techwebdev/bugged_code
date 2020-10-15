import { combineReducers } from "redux";
import { reducer as toastrReducer } from "react-redux-toastr";
import auth from "./auth";

const rootReducer = combineReducers({
  toastr: toastrReducer,
  auth,
});

export default rootReducer;
