import { type ReactNode, createContext, useContext, useState } from "react";
import { Dialog } from "tamagui";

type ModalContextType = {
  showModal: (content: ReactNode) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};

type ModalProviderProps = {
  children: ReactNode;
};

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showModal = (content: ReactNode) => {
    console.log("showModal", content);
    setModalContent(content);

    if (!isVisible) {
      setIsVisible(true);
    }
  };

  const hideModal = () => {
    setIsVisible(false);
    setTimeout(() => {
      setModalContent(null);
    }, 300);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <Dialog onOpenChange={open => !open && hideModal()} open={isVisible}>
        <Dialog.Overlay key="overlay" />
        <Dialog.Content
          key="content"
          animation={[
            "quick",
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
          animateOnly={["transform", "opacity"]}
          bordered
        >
          {modalContent}
        </Dialog.Content>

        <Dialog.Adapt platform="touch">
          <Dialog.Sheet>
            <Dialog.Sheet.Frame>
              <Dialog.Adapt.Contents />
            </Dialog.Sheet.Frame>
            <Dialog.Sheet.Overlay />
          </Dialog.Sheet>
        </Dialog.Adapt>
      </Dialog>
    </ModalContext.Provider>
  );
};
