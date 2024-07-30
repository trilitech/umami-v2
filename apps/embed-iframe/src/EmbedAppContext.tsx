import { createContext, PropsWithChildren, useContext, useRef } from "react";

import { Network, TypeOfLogin, UserData } from "@trilitech-umami/umami-embed/types";

const USER_DATA_KEY = "umami-embed-user-data";

interface EmbedAppContextState {
  getUserData: () => UserData | null;
  getNetwork: () => Network | null;
  getLoginOptions: () => TypeOfLogin[];
  setUserData: (userData: UserData | null) => void;
  setNetwork: (network: Network) => void;
  setLoginOptions: (loginOptions: TypeOfLogin[]) => void;
}

const EmbedAppContext = createContext<EmbedAppContextState | undefined>(undefined);

export const EmbedAppProvider = ({ children }: PropsWithChildren) => {
  const userDataRef = useRef<UserData | null>(
    JSON.parse(localStorage.getItem(USER_DATA_KEY) || "null")
  );
  const networkRef = useRef<Network | null>(null);

  const loginOptionsRef = useRef<TypeOfLogin[]>(["google", "reddit", "twitter", "facebook"]);

  const getUserData = () => userDataRef.current;
  const getNetwork = () => networkRef.current;
  const getLoginOptions = () => loginOptionsRef.current;

  const setUserData = (userData: UserData | null) => {
    if (userData !== null) {
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } else {
      localStorage.removeItem(USER_DATA_KEY);
    }
    userDataRef.current = userData;
  };

  const setNetwork = (network: Network) => (networkRef.current = network);
  const setLoginOptions = (loginOptions: TypeOfLogin[]) => (loginOptionsRef.current = loginOptions);

  return (
    <EmbedAppContext.Provider
      value={{ getUserData, getNetwork, getLoginOptions, setUserData, setNetwork, setLoginOptions }}
    >
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
