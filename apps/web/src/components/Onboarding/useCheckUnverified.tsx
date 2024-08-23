import { useEffect, useState } from "react";

export const useCheckVerified = () => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const isVerified = localStorage.getItem("user:verified");

    setIsVerified(isVerified ? JSON.parse(isVerified) : false);
  }, []);

  return isVerified;
};
