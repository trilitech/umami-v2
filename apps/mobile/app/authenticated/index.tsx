import { useCurrentAccount } from "@umami/state";
import { Text, View } from "react-native";

import { useAuthGuard } from "../../hooks/useAuthGuard";

export default function AuthenticatedIndex() {
  const user = useCurrentAccount();

  useAuthGuard(!!user);
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Welcome to the Authenticated Section!</Text>
    </View>
  );
}
