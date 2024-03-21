import { UseToastOptions, useToast } from "@chakra-ui/react";
import { useCallback, useRef, useState } from "react";

import { getErrorContext } from "../getErrorContext";
import { useAppDispatch } from "../redux/hooks";
import { errorsSlice } from "../redux/slices/errorsSlice";

/**
 * Hook for gracefully handling async actions.
 *
 * If an action fails, it'll show a toast with a corresponding message
 * and saves the error details in the error logs.
 *
 * It prevents multiple clicks on a button that triggers an async function.
 *
 * @returns
 *  isLoading - a boolean indicating whether the async action is in progress, is used in UI to disable buttons, showing a spinner, etc.
 *  handleAsyncActionUnsafe - a function that wraps the async function and handles the loading state, errors, and toasts. It throws an error if the async function fails.
 *  handleAsyncAction - same as handleAsyncActionUnsafe, but returns undefined instead of throwing an error.
 */
export const useAsyncActionHandler = () => {
  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(isLoading);
  const toast = useToast();
  const dispatch = useAppDispatch();

  const handleAsyncActionUnsafe = useCallback(
    async <T>(
      fn: () => Promise<T>,
      toastOptions?: UseToastOptions | ((error: any) => UseToastOptions)
    ): Promise<T | void> => {
      if (isLoadingRef.current) {
        return;
      }
      isLoadingRef.current = true;
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
        isLoadingRef.current = false;
        setIsLoading(false);
      }
    },
    [dispatch, toast]
  );

  // NOTE: might be helpful for debugging to remove the catch part of this function so that you'd see all the exceptions.
  const handleAsyncAction = useCallback(
    async <T>(
      fn: () => Promise<T>,
      toastOptions?: UseToastOptions | ((error: any) => UseToastOptions)
    ): Promise<T | void> => handleAsyncActionUnsafe(fn, toastOptions).catch(() => {}),
    [handleAsyncActionUnsafe]
  );

  return { isLoading, handleAsyncAction, handleAsyncActionUnsafe };
};
