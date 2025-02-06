import { useCurrentAccount } from "@umami/state";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export const useRedirectToAuthorized = () => {
  const currentAccount = useCurrentAccount();
  const router = useRouter();

  console.log("currentAccount", currentAccount);

  useEffect(() => {
    if (currentAccount) {
      router.push("/home");
    } else if (router.canGoBack()) {
      router.dismissAll();
    }
  }, [currentAccount, router]);
};
