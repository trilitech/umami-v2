import { useToast, UseToastOptions } from "@chakra-ui/react";
import { useState } from "react";

export const useSafeLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  // wraps an async function that might throw an error (e.g. network call, decryption, raw input parsing, etc.)
  // handles `isLoading` state and sets it back to `false` after the function is done
  //
  // if an exception was thrown it'll show a toast with the error message and re-throws
  // (might be needed to additionally handle the error in the caller function)
  //
  // helps to prevent multiple clicks on a button that triggers an async function
  // (though it's most likely is still vulnerable to race conditions)
  const withLoadingUnsafe = async <T>(
    fn: () => Promise<T>,
    getToastOptions?: UseToastOptions | ((error: any) => UseToastOptions)
  ): Promise<T | void> => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      return await fn();
    } catch (error: any) {
      let description = "Something went wrong";
      if ("message" in error) {
        description = error.message;
      } else if (typeof error === "string") {
        description = error;
      }
      let toastOptions: UseToastOptions = { title: "Error", description, status: "error" };
      if (getToastOptions) {
        toastOptions = {
          ...toastOptions,
          ...(typeof getToastOptions === "object" ? getToastOptions : getToastOptions(error)),
        };
      }
      toast(toastOptions);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // same as withLoadingUnsafe, but returns undefined instead of throwing an error
  const withLoading = async <T>(
    fn: () => Promise<T>,
    getToastOptions?: UseToastOptions | ((error: any) => UseToastOptions)
  ): Promise<T | void> => withLoadingUnsafe(fn, getToastOptions).catch(() => {});

  return { isLoading, withLoading, withLoadingUnsafe };
};
