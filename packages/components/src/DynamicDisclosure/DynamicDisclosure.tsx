import {
  Drawer,
  DrawerOverlay,
  Modal,
  ModalOverlay,
  type ThemingProps,
  useDisclosure,
} from "@chakra-ui/react";
import {
  type PropsWithChildren,
  type ReactElement,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { RemoveScroll } from "react-remove-scroll";

const useDisclosureHistory = <S,>(initialStep: S) => {
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

interface DynamicDisclosureContextType {
  openWith: (
    content: ReactElement,
    props?: ThemingProps & {
      onClose?: () => void | Promise<void>;
      mode?: DynamicDisclosureMode;
    }
  ) => Promise<void>;
  onClose: () => void;
  goBack: () => void;
  isOpen: boolean;
}

/**
 * You need to wrap the app into `DynamicDisclosureProvider` and then
 * use it in components as `useDynamicDisclosureContext` to interact with the modal.
 */
export const DynamicDisclosureContext = createContext<DynamicDisclosureContextType>({
  goBack: /* istanbul ignore next */ () => {},
  openWith: /* istanbul ignore next */ _ => Promise.resolve(),
  onClose: /* istanbul ignore next */ () => {},
  isOpen: false,
});

export const useDynamicDisclosureContext = () => useContext(DynamicDisclosureContext);

type DynamicDisclosureMode = "modal" | "drawer";

/**
 * It's easier to have just one global place where you can put a modal
 * and open it from anywhere in the app instead of including a modal related
 * code in each place where it's used. Sometimes, it's even a problem because we
 * need to have a modal next to a button that was created in a loop (e.g. lots of unused data).
 *
 * This hook solves this problem. It wraps the whole app in a context provider so that any
 * component can open a modal from anywhere in the app using the `openWith` function.
 * This hook should be used only once in the app. You place the modal wrapper and then
 * use the `openWith` provided by the `DynamicDisclosureContext` in components.
 *
 */
export const useDynamicDisclosure = () => {
  const { isOpen, onClose: closeDisclosure, onOpen } = useDisclosure();
  const [disclosureContent, setDisclosureContent] = useState<ReactElement | null>(null);
  const { currentStep, goBack, goToStep, reset } = useDisclosureHistory(disclosureContent);
  const [mode, setMode] = useState<DynamicDisclosureMode>("modal");
  const defaultProps = {
    size: "md",
    onClose: closeDisclosure,
  };
  const [disclosureProps, setDisclosureProps] = useState<
    ThemingProps & { onClose: () => void | Promise<void> }
  >(defaultProps);

  const openWith = async (
    content: ReactElement,
    props: ThemingProps & {
      onClose?: () => void | Promise<void>;
      mode?: DynamicDisclosureMode;
    } = {}
  ) => {
    const onClose = () => {
      closeDisclosure();
      reset();
      void props.onClose?.();
      setDisclosureProps(defaultProps);
    };

    setMode(props.mode || "modal");
    setDisclosureProps({ size: "md", ...props, onClose });
    setDisclosureContent(content);
    goToStep(content);
    onOpen();
    return Promise.resolve();
  };

  const renderContent = () => {
    if (mode === "modal") {
      return (
        <Modal
          autoFocus={false}
          blockScrollOnMount={false}
          closeOnOverlayClick={false}
          isCentered
          isOpen={isOpen}
          motionPreset="slideInBottom"
          {...disclosureProps}
        >
          <ModalOverlay />
          <RemoveScroll enabled={isOpen}>{currentStep}</RemoveScroll>
        </Modal>
      );
    } else {
      return (
        <Drawer isOpen={isOpen} placement="right" {...disclosureProps}>
          <DrawerOverlay />
          <RemoveScroll enabled={isOpen}>{currentStep}</RemoveScroll>
        </Drawer>
      );
    }
  };

  return {
    isOpen,
    onClose: disclosureProps.onClose,
    openWith,
    goBack,
    content: renderContent(),
  };
};

export const DynamicDisclosureProvider = ({ children }: PropsWithChildren) => {
  const disclosure = useDynamicDisclosure();

  return (
    <DynamicDisclosureContext.Provider value={disclosure}>
      {children}
      {disclosure.content}
    </DynamicDisclosureContext.Provider>
  );
};
