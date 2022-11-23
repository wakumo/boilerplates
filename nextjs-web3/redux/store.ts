import storage from "redux-persist/lib/storage";

import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import rootReducer from "./reducers";

const persistConfig = {
  key: "root",
  storage: storage,
  whitelist: ["network"], //Things u want to persist
  //   blacklist: [], //Things u dont
};

// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
