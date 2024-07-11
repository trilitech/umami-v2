import React, { createContext, ReactNode, useContext, useRef } from "react";

import { Network, UserData } from "@trilitech-umami/umami-embed/types";

interface EmbedAppContextState {
  userDataRef: React.MutableRefObject<UserData | null>;
  networkRef: React.MutableRefObject<Network | null>;
}

const EmbedAppContext = createContext<EmbedAppContextState | undefined>(undefined);

export const EmbedAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const userDataRef = useRef<UserData | null>(null);
  const networkRef = useRef<Network | null>(null);

  return (
    <EmbedAppContext.Provider value={{ userDataRef, networkRef }}>
      {children}
    </EmbedAppContext.Provider>
  );
};

export const useEmbedApp = (): EmbedAppContextState => {
  const context = useContext(EmbedAppContext);
  if (context === undefined) {
    throw new Error("useEmbedApp must be used within a EmbedAppProvider");
  }
  return context;
};
