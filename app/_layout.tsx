import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ContentProvider } from "@/hooks/content-store";
import { trpc, trpcClient } from "@/lib/trpc";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerBackTitle: "Back",
      headerStyle: {
        backgroundColor: '#0a0a0a',
      },
      headerTintColor: '#fff',
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="add-content" 
        options={{ 
          title: "Add Content",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="content/[id]" 
        options={{ 
          title: "",
          headerTransparent: true,
          headerBlurEffect: "dark"
        }} 
      />
      <Stack.Screen 
        name="edit-episode" 
        options={{ 
          title: "Edit Episode",
          presentation: "modal"
        }} 
      />
      <Stack.Screen 
        name="collections" 
        options={{ 
          title: "Collections"
        }} 
      />
      <Stack.Screen 
        name="watchlist" 
        options={{ 
          title: "Watchlist"
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ContentProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </ContentProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}