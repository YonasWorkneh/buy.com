"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import favoritesReducer, { type FavoritesState } from "./favoritesSlice";
import cartReducer, { type CartState } from "./cartSlice";

const rootReducer = combineReducers({
  favorites: favoritesReducer,
  cart: cartReducer,
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
    const storedFavorites = window.localStorage.getItem("favorites");
    const storedCart = window.localStorage.getItem("cart");

    const preloaded: Partial<RootState> = {};

    if (storedFavorites) {
      preloaded.favorites = JSON.parse(storedFavorites) as FavoritesState;
    }
    if (storedCart) {
      preloaded.cart = JSON.parse(storedCart) as CartState;
    }

    return Object.keys(preloaded).length ? preloaded : undefined;
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

export const persistCartToStorage = (state: CartState) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem("cart", JSON.stringify(state));
  } catch {
    // ignore write errors
  }
};
