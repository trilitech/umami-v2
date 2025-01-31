import type Web3Auth from "@web3auth/react-native-sdk";
import { type PropsWithChildren, createContext, useContext, useEffect } from "react";

import { web3auth } from "../services/auth/AuthClient";
import { useRedirectToAuthorized } from "../services/auth/useRedirectToAuthorized";

type AuthContextType = {
  web3auth: Web3Auth;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  useRedirectToAuthorized();

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        await web3auth.init();
        console.log("web3auth initialized");
      } catch (error) {
        console.error("Error initializing web3auth", error);
      }
    };

    if (!web3auth.connected) {
      void initWeb3Auth();
    }
  }, []);

  return <AuthContext.Provider value={{ web3auth }}>{children}</AuthContext.Provider>;
};
