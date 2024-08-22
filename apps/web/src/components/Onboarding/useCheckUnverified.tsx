import { useEffect, useState } from "react";

export const useCheckUnverified = () => {
  const [isUnverified, setIsUnverified] = useState(false);

  useEffect(() => {
    const isUnverified = localStorage.getItem("user:unverified");

    setIsUnverified(!!isUnverified);
  }, []);

  return isUnverified;
};
