import { useDataPolling } from "@umami/data-polling";

import { Layout } from "./Layout";

export const App = () => {
  useDataPolling();

  return <Layout />;
};
