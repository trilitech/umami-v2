import { useCurrentAccount } from "@umami/state";

import HomeScreen from "./home";
import Onboarding from "./onboarding";

export default function MainStack() {
  const currentAccount = useCurrentAccount();
  console.log("currentAccount", currentAccount);

  if (!currentAccount) {
    return <Onboarding />;
  }
  return <HomeScreen />;
}
