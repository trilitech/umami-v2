import { UseToastOptions, useToast } from "@chakra-ui/react";
import { useState } from "react";

import { getErrorContext } from "../getErrorContext";
import { useAppDispatch } from "../redux/hooks";
import { errorsSlice } from "../redux/slices/errorsSlice";

export const useAsyncActionHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const dispatch = useAppDispatch();

  // wraps an async function that might throw an error (e.g. network call, decryption, raw input parsing, etc.)
  // handles `isLoading` state and sets it back to `false` after the function is done
  //
  // if an exception was thrown it'll show a toast with the error message and re-throws and dispatches the error to redux
  // (might be needed to additionally handle the error in the caller function)
  //
  // helps to prevent multiple clicks on a button that triggers an async function
  // (though it's most likely is still vulnerable to race conditions)
  const handleAsyncActionUnsafe = async <T>(
    fn: () => Promise<T>,
    toastOptions?: UseToastOptions | ((error: any) => UseToastOptions)
  ): Promise<T | void> => {
    if (isLoading) {
      return;
    }
    setIsLoading(true);
    try {
      return await fn();
    } catch (error: any) {
      const errorContext = getErrorContext(error);

      toast({
        description: errorContext.description,
        status: "error",
        ...(typeof toastOptions === "function" ? toastOptions(error) : toastOptions),
      });

      dispatch(errorsSlice.actions.add(errorContext));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * same as {@link handleAsyncActionUnsafe}, but returns undefined instead of throwing an error
   *
   * NOTE: might be helpful in tests to remove the catch part of this function so that you'd see all the exceptions
   *  */
  const handleAsyncAction = async <T>(
    fn: () => Promise<T>,
    toastOptions?: UseToastOptions | ((error: any) => UseToastOptions)
  ): Promise<T | void> => handleAsyncActionUnsafe(fn, toastOptions).catch(() => {});

  return { isLoading, handleAsyncAction, handleAsyncActionUnsafe };
};
