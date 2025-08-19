import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import React from "react";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#e50914",
        tabBarInactiveTintColor: "#808080",
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopColor: '#1a1a1a',
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: '#000000',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "Add",
          tabBarIcon: ({ color }) => <Feather name="plus" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: "My List",
          tabBarIcon: ({ color }) => <Feather name="archive" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="discover"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => <Feather name="trending-up" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}