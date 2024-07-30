import { useDisclosure } from "@chakra-ui/react";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface LoginModalContextState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
}

const LoginModalContext = createContext<LoginModalContextState | undefined>(undefined);

export const LoginModalProvider = ({ children }: PropsWithChildren) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoginModalContext.Provider value={{ isOpen, onOpen, onClose, isLoading, setIsLoading }}>
      {children}
    </LoginModalContext.Provider>
  );
};

export const useLoginModalContext = (): LoginModalContextState => {
  const context = useContext(LoginModalContext);
  if (context === undefined) {
    throw new Error("useLoginModal must be used within a LoginModalProvider");
  }
  return context;
};
