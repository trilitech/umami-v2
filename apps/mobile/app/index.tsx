import { useCurrentAccount } from "@umami/state";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

import { useAuthGuard } from "../hooks/useAuthGuard";
import { OnboardingScreen } from "../screens/Onboarding";

export default function Index() {
  const router = useRouter();
  const account = useCurrentAccount();
  const { loggedOut } = useLocalSearchParams();
  console.log("logged out", loggedOut);
  const isAuthenticated = !!account;
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true); // Ensures component is mounted before triggering navigation
  }, []);

  useAuthGuard(isAuthenticated);
  useEffect(() => {
    if (hasMounted && account && !loggedOut) {
      console.log("Redirecting to /authenticated/home...");
      router.replace("/authenticated/home"); // ✅ Corrected placement inside useEffect
    }
  }, [hasMounted, account, router]);

  if(!hasMounted){
    return (<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator color="#000" size="large" />
      <Text>Redirecting...</Text>
    </View>)
  }
  return <OnboardingScreen />;
}
