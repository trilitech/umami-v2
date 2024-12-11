import { type UseToastOptions } from "@chakra-ui/react";
import { getErrorContext } from "@umami/utils";
import { useCallback, useRef, useState } from "react";

import { useAppDispatch } from "./useAppDispatch";
import { errorsActions } from "../slices";
import { mockToast } from "../testUtils";

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
  const toast: any = undefined; // useToast();
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
          isClosable: true,
          ...(typeof toastOptions === "function" ? toastOptions(error) : toastOptions),
        });

        // TODO: fix this dirty hack
        mockToast({
          description: errorContext.description,
          status: "error",
          isClosable: true,
          ...(typeof toastOptions === "function" ? toastOptions(error) : toastOptions),
        });

        dispatch(errorsActions.add(errorContext));
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
