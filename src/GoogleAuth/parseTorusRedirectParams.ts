/**
 * This function parses the deeplink url we get on a successful social auth.
 *
 * The parameters are built by
 * https://github.com/trilitech/umami-web/blob/main/public/auth/v2.x/redirect.html
 *
 * which is essentially a copy of
 * https://github.com/torusresearch/CustomAuth/blob/master/serviceworker/redirect.html
 */

import { invert } from "lodash";
import { unzipurl } from "zipurl";

/**
 * these search params are used to reduce the size of the URL
 * which has a limit in some browsers set to 2k characters
 */
const PARAMS_MAPPING = {
  at: "access_token",
  a: "authuser",
  ei: "expires_in",
  it: "id_token",
  ii: "instanceId",
  p: "prompt",
  sc: "scope",
  st: "state",
  vi: "version_info",
};

const PARAMS_REVERSE_MAPPING = invert(PARAMS_MAPPING);

export const parseTorusRedirectParams = (url: string) => {
  const params = new URLSearchParams(unzipurl(url.replace("umami://auth/", "")));

  const assignValues = (acc: any, key: string) => {
    acc[key] = params.get(PARAMS_REVERSE_MAPPING[key]) ?? params.get(key);
    return acc;
  };

  const instanceParams = {
    verifier: "umami",
    redirectToOpener: "true",
    typeOfLogin: "google",
    ...assignValues({}, "instanceId"),
  };

  const hashParams = {
    hd: "trili.tech",
    token_type: "Bearer",
    ...["state", "access_token", "expires_in", "scope", "id_token", "authuser", "prompt"].reduce(
      assignValues,
      {}
    ),
  };

  return {
    channel: `redirect_channel_${instanceParams.instanceId}`,
    data: { instanceParams, hashParams },
    ...assignValues({}, "error"),
  };
};
