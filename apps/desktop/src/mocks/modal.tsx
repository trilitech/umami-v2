import { type PropsWithChildren, createContext, useContext } from "react";

const ModalContext = createContext<{ onClose: () => void }>({ onClose: () => {} });

export const MockModal = ({
  children,
  isOpen,
  onClose,
}: PropsWithChildren<{ isOpen: boolean; onClose: () => void }>) => (
  <ModalContext.Provider value={{ onClose }}>
    <div data-testid="mock-modal">{isOpen ? children : null}</div>
  </ModalContext.Provider>
);

export const MockModalHeader = ({ children }: PropsWithChildren) => (
  <div id="modal-header">{children}</div>
);

export const MockModalContent = ({ children }: PropsWithChildren) => (
  <section aria-labelledby="modal-header" aria-modal role="dialog">
    {children}
  </section>
);

export const MockModalInnerComponent = ({ children }: PropsWithChildren) => <div>{children}</div>;

export const MockModalCloseButton = ({ children }: PropsWithChildren) => {
  const { onClose } = useContext(ModalContext);

  return (
    <button aria-label="Close" onClick={onClose} type="button">
      {children}
    </button>
  );
};
