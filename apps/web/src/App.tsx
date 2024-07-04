import { DynamicModalContext, useDynamicModal } from "@umami/components";
import { useDataPolling } from "@umami/data-polling";

import { Layout } from "./Layout";

export const App = () => {
  useDataPolling();
  const dynamicModal = useDynamicModal();

  return (
    <DynamicModalContext.Provider value={dynamicModal}>
      <Layout />
      {dynamicModal.content}
    </DynamicModalContext.Provider>
  );
};
