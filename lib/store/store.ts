"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import favoritesReducer, { type FavoritesState } from "./favoritesSlice";

const rootReducer = combineReducers({
  favorites: favoritesReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState,
  });

export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];

export const selectFavorites = (state: RootState) => state.favorites.items;

export const loadFavoritesFromStorage = (): Partial<RootState> | undefined => {
  if (typeof window === "undefined") return undefined;
  try {
    const stored = window.localStorage.getItem("favorites");
    if (!stored) return undefined;
    const parsed = JSON.parse(stored) as FavoritesState;
    return { favorites: parsed };
  } catch {
    return undefined;
  }
};

export const persistFavoritesToStorage = (state: FavoritesState) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("favorites", JSON.stringify(state));
  } catch {
    // ignore write errors
  }
};
