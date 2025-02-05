import { useDataPolling } from "@umami/data-polling";

import { Home as HomeScreen } from "../../../screens/Home";

export default function Home() {
  useDataPolling();

  return <HomeScreen />;
}
