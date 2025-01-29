import { useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

export const useAuthGuard = (isAuthenticated: boolean) => {

  const router = useRouter();
  const segments = useSegments();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
  }, [isAuthenticated]);

  useEffect(() => {
    if (mounted) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const isRootIndex = segments.length === 0;
      console.log("segments", segments);
      if (!isAuthenticated && !isRootIndex) {
        console.log("Redirecting to /onboarding...");
        router.replace("/");
      }
    }
  }, [isAuthenticated, segments, mounted, router]);
};
