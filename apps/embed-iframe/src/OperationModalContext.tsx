import { useDisclosure } from "@chakra-ui/react";
import { EstimatedAccountOperations } from "@umami/core";
import { createContext, PropsWithChildren, useContext, useState } from "react";

interface OperationModalContextState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  estimatedOperations: EstimatedAccountOperations | null;
  setEstimatedOperations: (estimatedOperations: EstimatedAccountOperations | null) => void;
}

const OperationModalContext = createContext<OperationModalContextState | undefined>(undefined);

export const OperationModalProvider = ({ children }: PropsWithChildren) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [estimatedOperations, setEstimatedOperations] = useState<EstimatedAccountOperations | null>(
    null
  );

  return (
    <OperationModalContext.Provider
      value={{
        isOpen,
        onOpen,
        onClose,
        isLoading,
        setIsLoading,
        estimatedOperations,
        setEstimatedOperations,
      }}
    >
      {children}
    </OperationModalContext.Provider>
  );
};

export const useOperationModalContext = (): OperationModalContextState => {
  const context = useContext(OperationModalContext);
  if (context === undefined) {
    throw new Error("useOperationModal must be used within a OperationModalProvider");
  }
  return context;
};
