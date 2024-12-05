import { useToast } from "@chakra-ui/react";
import { errorsActions, useAppDispatch } from "@umami/state";
import { getErrorContext } from "@umami/utils";
import { useCallback } from "react";

export const useReactQueryErrorHandler = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();
  const toastId = "data-fetching-error";

  return useCallback(
    (error: any) => {
      if (!error) {
        return;
      }
      dispatch(errorsActions.add(getErrorContext(error)));

      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          description: `Data fetching error: ${error.message}`,
          status: "error",
          isClosable: true,
          duration: 10000,
        });
      }
      console.error(error);
    },
    [dispatch, toast]
  );
};
