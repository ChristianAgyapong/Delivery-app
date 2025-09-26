import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="restaurant/[id]" />
        <Stack.Screen name="cart" />
        <Stack.Screen name="checkout" />
        <Stack.Screen name="favorites" />
        <Stack.Screen name="tracking/[orderId]" />
        
        {/* Profile Screens */}
        <Stack.Screen name="customer-profile" />
        <Stack.Screen name="restaurant-profile" />
        <Stack.Screen name="delivery-profile" />
        <Stack.Screen name="admin-profile" />
        
        {/* Dashboard Screens */}
        <Stack.Screen name="restaurant-dashboard" />
        <Stack.Screen name="delivery-dashboard" />
        <Stack.Screen name="admin-dashboard" />
      </Stack>
    </>
  );
}
