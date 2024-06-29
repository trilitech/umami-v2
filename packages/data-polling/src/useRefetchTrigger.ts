import { useAppSelector } from "@umami/state";

export const useRefetchTrigger = () => useAppSelector(state => state.assets.refetchTrigger);
