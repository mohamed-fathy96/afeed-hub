import { configureStore } from "@reduxjs/toolkit";
//root reducer
import { rootReducer } from "./rootReducer";
import { logger } from "redux-logger";

const isDevelopment = process.env.NODE_ENV === "development";
const middleware: any = isDevelopment ? [logger] : [];

export const store = configureStore({
  reducer: rootReducer,
  devTools: isDevelopment,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
