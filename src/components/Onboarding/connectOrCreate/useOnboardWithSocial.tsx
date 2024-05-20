import { useToast } from "@chakra-ui/react";
import { minutesToMilliseconds } from "date-fns";
import { useCallback } from "react";

import * as Auth from "../../../auth";
import { useRestoreSocial } from "../../../utils/hooks/setAccountDataHooks";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { getPublicKeyPairFromSk } from "../../../utils/tezos";
import { withTimeout } from "../../../utils/withTimeout";

const LOGIN_TIMEOUT = minutesToMilliseconds(1);

/**
 * Hook to onboard with a social identity provider.
 * Handles the authentication process and adds the account to the user's wallet.
 *
 * @param idp - the identity provider to use for authentication
 * @param onAuth - callback which will be called on a successful authentication
 */
export const useOnboardWithSocial = (idp: Auth.IDP, onAuth: () => void) => {
  const toast = useToast();
  const { isLoading, handleAsyncAction } = useAsyncActionHandler();
  const restoreSocial = useRestoreSocial();

  const onboard = useCallback(
    () =>
      handleAsyncAction(
        async () => {
          const { secretKey, name } = await withTimeout(
            () => Auth.forIDP(idp).getCredentials(),
            LOGIN_TIMEOUT
          );
          const { pk, pkh } = await getPublicKeyPairFromSk(secretKey);
          restoreSocial(pk, pkh, name, idp);
          toast({ description: `Successfully added ${name} account`, status: "success" });
          onAuth();
        },
        { title: "Social login failed" }
      ),
    [idp, toast, handleAsyncAction, restoreSocial, onAuth]
  );

  return { isLoading, onboard };
};
