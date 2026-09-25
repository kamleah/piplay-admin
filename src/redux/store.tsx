import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import LoginSlice from "./Slices/LoginSlice";
import DataSlice from "./Slices/DataSlice";

const reducers = {
  user: LoginSlice,
  alldata: DataSlice
};

const persistConfig = {
  key: "piplay",
  version: 1,
  storage,
};

const persistedReducer = persistReducer(persistConfig, combineReducers(reducers));

const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false, // Disable serializable check as Redux Toolkit uses Immer
  }),
});

export default store;
