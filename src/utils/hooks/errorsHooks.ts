import { useAppSelector } from "../redux/hooks";

export const useSortedErrors = () => {
  const errors = useAppSelector(s => s.errors);
  return [...errors].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};
