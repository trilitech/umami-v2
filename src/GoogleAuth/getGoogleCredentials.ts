import { Prefix, b58cencode, prefix } from "@taquito/utils";
import CustomAuth from "@toruslabs/customauth";

import { withTimeout } from "../utils/withTimeout";

const LOGIN_TIMEOUT = 60 * 1000; // 1 minute
const WEB3_AUTH_CLIENT_ID =
  "BBHmFdLXgGDzSiizRVMWtyL_7Dsoxu5B8zep2Pns8sGELslgXDbktJewVDVDDBlknEKkMCtzISLjJtxk60SK2-g";
const SUB_VERIFIER_CLIENT_ID =
  "1070572364808-d31nlkneam5ee6dr0tu28fjjbsdkfta5.apps.googleusercontent.com";

/**
 * This function will open a popup window with the google auth page.
 * Once the user authorizes the function will navigate the user back to Umami app.
 * In the end we obtain the user's email and raw secret key.
 *
 * The function has a timeout to prevent infinite loading state.
 */
export const getGoogleCredentials = async () =>
  withTimeout(async () => {
    const torus = new CustomAuth({
      web3AuthClientId: WEB3_AUTH_CLIENT_ID,
      baseUrl: "https://umamiwallet.com/auth/v2.0.1/",
      redirectPathName: "redirect.html",
      redirectToOpener: true,
      uxMode: "popup",
      network: "mainnet",
    });
    await torus.init({ skipSw: true });

    const result = await torus.triggerAggregateLogin({
      verifierIdentifier: "tezos-google",
      aggregateVerifierType: "single_id_verifier",
      subVerifierDetailsArray: [
        {
          clientId: SUB_VERIFIER_CLIENT_ID,
          typeOfLogin: "google",
          verifier: "umami",
        },
      ],
    });
    const privateKey = result.finalKeyData.privKey || result.oAuthKeyData.privKey;
    const secretKey = b58cencode(privateKey, prefix[Prefix.SPSK]);

    return {
      secretKey,
      email: result.userInfo[0].email,
    };
  }, LOGIN_TIMEOUT);
