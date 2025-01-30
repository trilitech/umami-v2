import { useAppDispatch } from "./useAppDispatch";

export const useResetState = () => {
  const dispatch = useAppDispatch();

  return () => dispatch({ type: "RESET_ALL" });
};
