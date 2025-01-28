import { useCurrentAccount } from "@umami/state";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export const useRedirectToAuthorized = () => {
  const currentAccount = useCurrentAccount();
  const router = useRouter();

  console.log("currentAccount", currentAccount);

  useEffect(() => {
    if (currentAccount) {
      console.log("redirecting to home")
      router.replace("/home");
    }
  }, [currentAccount, router]);
};
