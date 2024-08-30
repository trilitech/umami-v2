import { useAppSelector } from "@umami/state";

export const useCheckVerified = () => {
  const isVerified = useAppSelector(state => state.accounts.isVerified);

  return isVerified;
};
