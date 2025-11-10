"use client";

import { ReactNode, useEffect, useState } from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import {
  makeStore,
  loadFavoritesFromStorage,
  persistFavoritesToStorage,
  persistCartToStorage,
  type AppStore,
} from "@/lib/store/store";

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [store] = useState<AppStore>(() => {
    const preloadedState = loadFavoritesFromStorage();
    return makeStore(preloadedState);
  });

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const { favorites } = store.getState();
      persistFavoritesToStorage(favorites);
      persistCartToStorage(store.getState().cart);
    });
    return () => unsubscribe();
  }, [store]);

  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              borderRadius: "0.75rem",
              padding: "0.75rem 1rem",
              fontSize: "0.9rem",
            },
            success: {
              style: {
                background: "#DCFCE7",
                color: "#166534",
              },
            },
            error: {
              style: {
                background: "#FEE2E2",
                color: "#991B1B",
              },
            },
          }}
        />
      </Provider>
    </QueryClientProvider>
  );
}
