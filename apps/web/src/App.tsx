import { useDataPolling } from "@umami/data-polling";
import { useCurrentAccount } from "@umami/state";

import { Layout } from "./Layout";

export const App = () => {
  useDataPolling();
  const currentAccount = useCurrentAccount();

  if (!currentAccount) {
    // TODO: replace with onboarding
    return "No account selected";
  }

  return <Layout />;
};
