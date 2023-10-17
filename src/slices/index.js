import { combineReducers, configureStore } from "@reduxjs/toolkit";

// Front

import authToolkit from "./toolkit/auth";

const combinedReducer = combineReducers({
  auth: authToolkit,
});

const rootReducer = (state, action) => {
  return combinedReducer(state, action)
}

// Create the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false,
  }),
});

