import {
  Drawer,
  DrawerOverlay,
  Modal,
  ModalOverlay,
  type ThemingProps,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  type PropsWithChildren,
  type ReactElement,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { RemoveScroll } from "react-remove-scroll";

interface DynamicDisclosureContextType {
  openWith: (
    content: ReactElement,
    props?: ThemingProps & {
      onClose?: () => void | Promise<void>;
    }
  ) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
  goBack: () => void;
}

const defaultContextValue = {
  openWith: async () => {},
  onClose: () => {},
  goBack: () => {},
  isOpen: false,
};

export const DynamicDisclosureContext =
  createContext<DynamicDisclosureContextType>(defaultContextValue);

/**
 * You need to wrap the app into `DynamicDisclosureProvider` and then
 * use it in components as `useDynamicModalContext` to interact with the modal.
 */
const DynamicModalContext = createContext<DynamicDisclosureContextType>(defaultContextValue);
const DynamicDrawerContext = createContext<DynamicDisclosureContextType>(defaultContextValue);

export const useDynamicModalContext = () => useContext(DynamicModalContext);
export const useDynamicDrawerContext = () => useContext(DynamicDrawerContext);

const TRANSITION_DURATION = 300;

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
const useDynamicDisclosure = () => {
  const stackRef = useRef<
    Array<{
      content: ReactElement;
      props: ThemingProps & { onClose: () => void | Promise<void> };
    }>
  >([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [currentItem, setCurrentItem] = useState<{
    content: ReactElement;
    props: ThemingProps & { onClose: () => void | Promise<void> };
  }>();

  const openWith = async (
    content: ReactElement,
    props: ThemingProps & {
      onClose?: () => void | Promise<void>;
    } = {}
  ) => {
    const onClose = () => {
      setCurrentIndex(() => {
        const newIndex = -1;
        stackRef.current = [];

        return newIndex;
      });

      void props.onClose?.();
    };

    const newItem = {
      content,
      props: { size: "md", ...props, onClose },
    };

    stackRef.current.push(newItem);
    setCurrentIndex(prev => prev + 1);
    return Promise.resolve();
  };

  const goBack = () => {
    setCurrentIndex(prevIndex => prevIndex - 1);
  };

  useEffect(() => {
    if (currentIndex >= 0) {
      setCurrentItem(stackRef.current[currentIndex]);
    } else {
      setTimeout(() => {
        setCurrentItem(undefined);
      }, TRANSITION_DURATION);
    }
  }, [currentIndex]);

  return {
    isOpen: currentIndex >= 0,
    onClose: currentIndex >= 0 ? stackRef.current[currentIndex].props.onClose : () => {},
    openWith,
    goBack,
    currentItem,
    currentIndex,
  };
};

const useDynamicModal = () => {
  const disclosure = useDynamicDisclosure();
  const motionPreset = useBreakpointValue({ base: "slideInBottom", lg: "scale" }) as any;

  const renderContent = () => {
    if (!disclosure.currentItem) return null;

    const { content, props } = disclosure.currentItem;

    return (
      <Modal
        autoFocus={false}
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isCentered
        isOpen={disclosure.isOpen}
        motionPreset={motionPreset}
        {...props}
      >
        <ModalOverlay />
        <RemoveScroll enabled={disclosure.isOpen}>{content}</RemoveScroll>
      </Modal>
    );
  };

  return {
    ...disclosure,
    content: renderContent(),
  };
};

const useDynamicDrawer = () => {
  const disclosure = useDynamicDisclosure();

  const renderContent = () => {
    if (!disclosure.currentItem) return null;

    const { content, props } = disclosure.currentItem;

    return (
      <Drawer isOpen={disclosure.isOpen} placement="right" {...props}>
        <DrawerOverlay />
        {content}
      </Drawer>
    );
  };

  return {
    ...disclosure,
    content: renderContent(),
  };
};

export const DynamicDisclosureProvider = ({ children }: PropsWithChildren) => {
  const modalDisclosure = useDynamicModal();
  const drawerDisclosure = useDynamicDrawer();

  return (
    <DynamicModalContext.Provider value={modalDisclosure}>
      <DynamicDrawerContext.Provider value={drawerDisclosure}>
        {children}
        {modalDisclosure.content}
        {drawerDisclosure.content}
      </DynamicDrawerContext.Provider>
    </DynamicModalContext.Provider>
  );
};
