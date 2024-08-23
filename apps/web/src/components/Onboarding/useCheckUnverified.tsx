import { useMemo } from "react";

export const useCheckVerified = () => {
  const isVerified = useMemo(() => {
    const isVerified = localStorage.getItem("user:verified");
    return isVerified ? JSON.parse(isVerified) : false;
  }, []);

  return isVerified;
};
