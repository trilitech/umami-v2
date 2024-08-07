import { Drawer, DrawerOverlay, Modal, ModalOverlay, type ThemingProps } from "@chakra-ui/react";
import {
  type PropsWithChildren,
  type ReactElement,
  createContext,
  useContext,
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
  hasPrevious: boolean;
}

const defaultContextValue = {
  openWith: async () => {},
  onClose: () => {},
  goBack: () => {},
  isOpen: false,
  hasPrevious: false,
};

/**
 * You need to wrap the app into `DynamicDisclosureProvider` and then
 * use it in components as `useDynamicModalContext` to interact with the modal.
 */
export const DynamicModalContext = createContext<DynamicDisclosureContextType>(defaultContextValue);
export const DynamicDrawerContext =
  createContext<DynamicDisclosureContextType>(defaultContextValue);

export const useDynamicModalContext = () => useContext(DynamicModalContext);
export const useDynamicDrawerContext = () => useContext(DynamicDrawerContext);

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
  const stackRef = useRef<
    Array<{
      content: ReactElement;
      props: ThemingProps & { onClose: () => void | Promise<void> };
    }>
  >([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const openWith = async (
    content: ReactElement,
    props: ThemingProps & {
      onClose?: () => void | Promise<void>;
    } = {}
  ) => {
    const onClose = () => {
      setCurrentIndex(-1);
      stackRef.current = [];
      return props.onClose?.();
    };

    stackRef.current.push({
      content,
      props: { ...props, onClose },
    });
    setCurrentIndex(current => current + 1);

    return Promise.resolve();
  };

  const goBack = () => {
    setCurrentIndex(current => current - 1);
    stackRef.current.pop();
  };

  const currentItem = stackRef.current[currentIndex] || null;

  return {
    isOpen: !!currentItem,
    onClose: currentItem?.props.onClose || (() => {}),
    openWith,
    goBack,
    content: currentItem?.content,
    props: currentItem?.props || {},
    hasPrevious: stackRef.current.length > 1,
  };
};

export const useDynamicModal = () => {
  const disclosure = useDynamicDisclosure();

  const { isOpen, props, content } = disclosure;

  return {
    ...disclosure,
    content: (
      <Modal
        autoFocus={false}
        blockScrollOnMount={false}
        closeOnOverlayClick={false}
        isCentered
        isOpen={isOpen}
        motionPreset="slideInBottom"
        {...props}
      >
        <ModalOverlay />
        <RemoveScroll enabled={isOpen}>{content}</RemoveScroll>
      </Modal>
    ),
  };
};

export const useDynamicDrawer = () => {
  const disclosure = useDynamicDisclosure();

  const { isOpen, content, props } = disclosure;

  return {
    ...disclosure,
    content: (
      <Drawer isOpen={isOpen} placement="right" {...props}>
        <DrawerOverlay />
        {content}
      </Drawer>
    ),
  };
};

export const DynamicDisclosureProvider = ({ children }: PropsWithChildren) => {
  const modalDisclosure = useDynamicModal();
  const drawerDisclosure = useDynamicDrawer();

  return (
    <DynamicModalContext.Provider value={modalDisclosure}>
      <DynamicDrawerContext.Provider value={drawerDisclosure}>
        {children}
        {drawerDisclosure.content}
        {modalDisclosure.content}
      </DynamicDrawerContext.Provider>
    </DynamicModalContext.Provider>
  );
};
