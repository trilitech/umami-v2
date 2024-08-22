import { useDisclosure } from "@chakra-ui/react";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { SigningType } from "@airgap/beacon-types";

interface SignPayloadModalContextState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  signingType: SigningType | null;
  setSigningType: (signingType: SigningType) => void;
  payload: string | null;
  setPayload: (payload: string) => void;
}

const SignPayloadModalContext = createContext<SignPayloadModalContextState | undefined>(undefined);

export const SignPayloadModalProvider = ({ children }: PropsWithChildren) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [signingType, setSigningType] = useState<SigningType | null>(null);
  const [payload, setPayload] = useState<string | null>(null);

  return (
    <SignPayloadModalContext.Provider
      value={{
        isOpen,
        onOpen,
        onClose,
        isLoading,
        setIsLoading,
        signingType,
        setSigningType,
        payload,
        setPayload,
      }}
    >
      {children}
    </SignPayloadModalContext.Provider>
  );
};

export const useSignPayloadModalContext = (): SignPayloadModalContextState => {
  const context = useContext(SignPayloadModalContext);
  if (context === undefined) {
    throw new Error("useSignPayloadModalContext must be used within a SignPayloadModalProvider");
  }
  return context;
};
