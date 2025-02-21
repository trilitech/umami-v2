import { useToast } from "@chakra-ui/react";
import { withTimeout } from "@umami/core";
import * as Auth from "@umami/social-auth";
import { useAsyncActionHandler, useRestoreSocial } from "@umami/state";
import { getPublicKeyPairFromSk } from "@umami/tezos";
import { minutesToMilliseconds } from "date-fns";
import { useCallback } from "react";

import {
  trackSocialLoginButtonClick,
  trackSuccessfulSocialConnection,
} from "../../../utils/analytics";
import { setupPersistence } from "../../../utils/store";

const LOGIN_TIMEOUT = minutesToMilliseconds(1);

/**
 * Hook to onboard with a social identity provider.
 * Handles the authentication process and adds the account to the user's wallet.
 *
 * @param idp - the identity provider to use for authentication
 * @param onAuth - callback which will be called on a successful authentication
 */
export const useOnboardWithSocial = (idp: Auth.IDP, onAuth?: () => void) => {
  const toast = useToast();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const restoreSocial = useRestoreSocial();

  const onboard = useCallback(
    () =>
      handleAsyncAction(
        async () => {
          trackSocialLoginButtonClick("onboarding", idp);
          const { secretKey, name, id, email } = await withTimeout(
            () => Auth.forIDP(idp).getCredentials(),
            LOGIN_TIMEOUT
          );
          const { pk, pkh } = await getPublicKeyPairFromSk(secretKey);
          restoreSocial(pk, pkh, email || name || id, idp);

          // Initialize persistence with the secret key
          setupPersistence(secretKey);

          trackSuccessfulSocialConnection("onboarding", idp);
          toast({ description: `Successfully added ${name || id} account`, status: "success" });
          onAuth?.();
        },
        { title: "Social login failed" }
      ),
    [idp, toast, handleAsyncAction, restoreSocial, onAuth]
  );

  return { isLoading, onboard };
};
