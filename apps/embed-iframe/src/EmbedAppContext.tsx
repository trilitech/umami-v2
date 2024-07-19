import React, { createContext, ReactNode, useContext, useRef } from "react";

import { Network, UserData } from "@trilitech-umami/umami-embed/types";

const USER_DATA_KEY = "umami-embed-user-data";
const NETWORK_KEY = "umami-embed-network";

interface EmbedAppContextState {
  getUserData: () => UserData | null;
  getNetwork: () => Network | null;
  setUserData: (userData: UserData | null) => void;
  setNetwork: (network: Network | null) => void;
}

const EmbedAppContext = createContext<EmbedAppContextState | undefined>(undefined);

export const EmbedAppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const userDataRef = useRef<UserData | null>(
    JSON.parse(localStorage.getItem(USER_DATA_KEY) || "null")
  );
  const networkRef = useRef<Network | null>(localStorage.getItem(NETWORK_KEY) as Network | null);

  const getUserData = () => userDataRef.current;
  const getNetwork = () => networkRef.current;

  const setUserData = (userData: UserData | null) => {
    if (userData !== null) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_DATA_KEY);
    }
    userDataRef.current = userData;
  };

  const setNetwork = (network: Network | null) => {
    if (network !== null) {
      localStorage.setItem(NETWORK_KEY, network);
    } else {
      localStorage.removeItem(NETWORK_KEY);
    }
    networkRef.current = network;
  };

  return (
    <EmbedAppContext.Provider value={{ getUserData, getNetwork, setUserData, setNetwork }}>
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
