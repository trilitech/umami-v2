import { type PropsWithChildren, createContext, useContext } from "react";

// TODO: fix this type when we have a better toast implementation
export type ToastOptions = any;

export type Toast = {
  show?: (options: ToastOptions) => void;
  [key: string]: any;
} & ((options: ToastOptions) => void);

type ToastContextType = {
  toast: Toast;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Hook to get the toast component depending on the environment (web or mobile)
 * @returns the toast instance
 */
export const useCustomToast = () => {
  const toastContext = useContext(ToastContext);
  if (!toastContext) {
    throw new Error("useCustomToast must be used within a ToastProvider");
  }
  return toastContext.toast;
};

export const ToastProvider = ({ children, toast }: PropsWithChildren<{ toast: Toast }>) => (
  <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>
);
