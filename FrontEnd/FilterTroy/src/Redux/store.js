import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import filterReducer from "./filterSlice";
import { localSlice, localSliceNoPresist } from "./localSlice";
import authReducer from "./authSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistAuthConfig = {
  key: "auth",
  version: 1,
  storage,
};

const persistLocalConfig = {
  key: "local",
  version: 1,
  storage,
};

const persistedAuthReducer = persistReducer(persistAuthConfig, authReducer);
const persistedLocalReducer = persistReducer(
  persistLocalConfig,
  localSlice.reducer
);

const reducer = combineReducers({
  filter: filterReducer,
  auth: persistedAuthReducer,
  local: persistedLocalReducer,
  localNoPresist: localSliceNoPresist.reducer,
});

const store = configureStore({
  reducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export default store;
