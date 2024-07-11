import {
  Modal,
  ModalOverlay,
  type ThemingProps,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import {
  type PropsWithChildren,
  type ReactElement,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { RemoveScroll } from "react-remove-scroll";

const useModalHistory = <S,>(initialStep: S) => {
  const [step, setStep] = useState<S>();
  const [history, setHistory] = useState<S[]>([]);

  useEffect(() => {
    if (initialStep && !step) {
      setStep(initialStep);
      setHistory([initialStep]);
    }
  }, [initialStep]);

  return {
    reset: () => {
      setStep(undefined);
      setHistory([]);
    },
    goToStep: (step: S) => {
      setStep(step);
      setHistory([...history, step]);
    },
    currentStep: step,
    goBack: () => {
      history.pop();
      const previous = history[history.length - 1];
      setHistory(history);
      setStep(previous);
    },
    history,
  };
};

/**
 * You need to wrap the app into `DynamicModalProvider` and then
 * use it in components as `useDynamicModalContext` to interact with the modal.
 */
export const DynamicModalContext = createContext<{
  openWith: (
    content: ReactElement,
    props?: ThemingProps & { onClose?: () => void | Promise<void> }
  ) => Promise<void>;
  onClose: () => void;
  goBack: () => void;
  isOpen: boolean;
}>({
  goBack: /* istanbul ignore next */ () => {},
  openWith: /* istanbul ignore next */ _ => Promise.resolve(),
  onClose: /* istanbul ignore next */ () => {},
  isOpen: false,
});

export const useDynamicModalContext = () => useContext(DynamicModalContext);

/**
 * It's easier to have just one global place where you can put a modal
 * and open it from anywhere in the app instead of including a modal related
 * code in each place where it's used. Sometimes, it's even a problem because we
 * need to have a modal next to a button that was created in a loop (e.g. lots of unused data).
 *
 * This hook solves this problem. It wraps the whole app in a context provider so that any
 * component can open a modal from anywhere in the app using the `openWith` function.
 * This hook should be used only once in the app. You place the modal wrapper and then
 * use the `openWith` provided by the `DynamicModalContext` in components.
 *
 */
export const useDynamicModal = () => {
  const { isOpen, onClose: closeModal, onOpen } = useDisclosure();
  const [modalContent, setModalContent] = useState<ReactElement | null>(null);
  const { currentStep, goBack, goToStep, reset } = useModalHistory(modalContent);
  const defaultModalProps = {
    size: "md",
    onClose: closeModal,
  };
  const [modalProps, setModalProps] = useState<
    ThemingProps & { onClose: () => void | Promise<void> }
  >(defaultModalProps);
  const motionPreset = useBreakpointValue({
    base: "slideInBottom",
    lg: "scale",
  } as const);

  const openWith = async (
    content: ReactElement,
    props: ThemingProps & { onClose?: () => void | Promise<void> } = {}
  ) => {
    const onClose = () => {
      closeModal();
      reset();
      void props.onClose?.();
      setModalProps(defaultModalProps);
    };

    setModalProps({ size: "md", ...props, onClose });
    setModalContent(content);
    goToStep(content);
    onOpen();
    return Promise.resolve();
  };

  return {
    isOpen,
    onClose: modalProps.onClose,
    openWith,
    goBack,
    content: (
      <Modal
        autoFocus={false}
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        motionPreset={motionPreset}
        {...modalProps}
      >
        <ModalOverlay />
        <RemoveScroll enabled={isOpen}>{currentStep}</RemoveScroll>
      </Modal>
    ),
  };
};

export const DynamicModalProvider = ({ children }: PropsWithChildren) => {
  const modal = useDynamicModal();

  return (
    <DynamicModalContext.Provider value={modal}>
      {children}
      {modal.content}
    </DynamicModalContext.Provider>
  );
};
