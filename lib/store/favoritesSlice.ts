"use client";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FavoriteProductSummary {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  rating: number;
}

export interface FavoritesState {
  items: FavoriteProductSummary[];
}

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    toggleFavorite: (
      state: FavoritesState,
      action: PayloadAction<FavoriteProductSummary>
    ) => {
      const exists = state.items.findIndex(
        (item: FavoriteProductSummary) => item.id === action.payload.id
      );
      if (exists >= 0) {
        state.items.splice(exists, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    clearFavorites: (state: FavoritesState) => {
      state.items = [];
    },
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
