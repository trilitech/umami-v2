import { useToast } from "@chakra-ui/react";
import { useCallback } from "react";

import { getErrorContext } from "./getErrorContext";
import { useAppDispatch } from "./redux/hooks";
import { errorsSlice } from "./redux/slices/errorsSlice";

export const useReactQueryErrorHandler = () => {
  const dispatch = useAppDispatch();
  const toast = useToast();

  const callback = useCallback(
    (error: any) => {
      if (!error) {
        return;
      }
      dispatch(errorsSlice.actions.add(getErrorContext(error)));
      toast({
        id: "data-fetching-error",
        description: `Data fetching error: ${error.message}`,
        status: "error",
        isClosable: true,
        duration: 10000,
      });
    },
    [dispatch, toast]
  );
  return callback;
};
