import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Modal,
  ModalOverlay,
  type ThemingProps,
} from "@chakra-ui/react";
import { cloneDeep, merge } from "lodash";
import {
  type PropsWithChildren,
  type ReactElement,
  type RefObject,
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
  goBack: (index?: number) => void;
  hasPrevious: boolean;
  formValues: Record<string, any>;
  allFormValues: RefObject<Record<string, any>>;
}

const defaultContextValue = {
  openWith: async () => {},
  onClose: () => {},
  goBack: () => {},
  isOpen: false,
  hasPrevious: false,
  formValues: {},
  allFormValues: { current: {} },
};

/**
 * You need to wrap the app into `DynamicDisclosureProvider` and then
 * use it in components as `useDynamicModalContext` to interact with the modal.
 */
export const DynamicModalContext = createContext<DynamicDisclosureContextType>(defaultContextValue);
export const DynamicDrawerContext =
  createContext<DynamicDisclosureContextType>(defaultContextValue);

/* istanbul ignore next */
export const useDynamicModalContext = () => useContext(DynamicModalContext);
/* istanbul ignore next */
export const useDynamicDrawerContext = () => useContext(DynamicDrawerContext);

type DisclosureStackItem = {
  content: ReactElement;
  props: ThemingProps & { onClose: () => void | Promise<void> };
  formValues: Record<string, any>;
};

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
  const stackRef = useRef<DisclosureStackItem[]>([]);
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
      formValues: {},
    });
    setCurrentIndex(current => current + 1);

    return Promise.resolve();
  };

  const goBack = (index = -1) => {
    if (index >= 0 && index < stackRef.current.length) {
      // Go to specific index
      const itemsToRemove = stackRef.current.length - index - 1;
      stackRef.current.splice(index + 1, itemsToRemove);
      setCurrentIndex(index);
    } else {
      // Default behavior: go back one step
      setCurrentIndex(current => current - 1);
      stackRef.current.pop();
    }
  };

  const currentItem = stackRef.current.at(currentIndex) || null;

  // Note: be careful not to use the same form input names
  // otherwise, the values will be overwritten with the ones from the latest form
  const allFormValues = useRef({});

  allFormValues.current = stackRef.current
    .map(item => item.formValues)
    .reduce((acc, curr) => merge(acc, cloneDeep(curr)), {});

  return {
    isOpen: !!currentItem,
    onClose: currentItem?.props.onClose || (() => {}),
    openWith,
    goBack,
    content: currentItem?.content,
    props: currentItem?.props || {},
    formValues: currentItem?.formValues || {},
    hasPrevious: stackRef.current.length > 1,
    allFormValues,
  };
};

export const useDynamicModal = () => {
  const disclosure = useDynamicDisclosure();

  const { isOpen, props, content, onClose } = disclosure;

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
        onClose={onClose}
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

  const { isOpen, content, props, onClose } = disclosure;

  return {
    ...disclosure,
    content: (
      <Drawer isOpen={isOpen} onClose={onClose} placement="right" {...props}>
        <DrawerOverlay />
        <DrawerContent>{content}</DrawerContent>
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
