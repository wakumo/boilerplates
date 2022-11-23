import { combineReducers } from "redux";
import networkSlice from "./slices/network-slice";

const rootReducer = combineReducers({
  network: networkSlice,
});

export default rootReducer;
