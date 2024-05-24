import { TorusAggregateLoginResponse, TorusLoginResponse } from "@toruslabs/customauth";

import { Auth } from "./Auth";
import { EmailAuth } from "./EmailAuth";
import { FacebookAuth } from "./FacebookAuth";
import { GoogleAuth } from "./GoogleAuth";
import { RedditAuth } from "./RedditAuth";
import { TwitterAuth } from "./TwitterAuth";

const rawSecretKey = "ad02df00ce58f9e3e1ff882661edbfa4e5a31b9ebceaa4e3e1fe810fb2ba38f2";
const secretKey = "spsk2jm29sHC99HDi64VBpSwEMZRQ7WfHdvQPVMZCkyWyR4spBrtRW";

describe("Auth", () => {
  const testCases = [
    {
      finalKey: rawSecretKey,
      oAuthKey: rawSecretKey,
      email: "some email",
      name: "some name",
      resultKey: secretKey,
      resultName: "some email",
    },
    {
      finalKey: rawSecretKey,
      oAuthKey: rawSecretKey,
      email: undefined,
      name: "some name",
      resultKey: secretKey,
      resultName: "some name",
    },
    {
      finalKey: rawSecretKey,
      oAuthKey: rawSecretKey,
      email: undefined,
      name: undefined,
      resultKey: secretKey,
      resultName: (p: Auth) => p.idpName,
    },
    {
      finalKey: rawSecretKey,
      oAuthKey: rawSecretKey + "some extra",
      email: undefined,
      name: undefined,
      resultKey: secretKey,
      resultName: (p: Auth) => p.idpName,
    },
    {
      finalKey: undefined,
      oAuthKey: rawSecretKey,
      email: "some email",
      name: "some name",
      resultKey: secretKey,
      resultName: "some email",
    },
  ];

  describe.each(testCases)(
    "for $finalKey, $oAuthKey, $email, $name",
    ({ finalKey, oAuthKey, email, name, resultKey, resultName }) => {
      it.each([GoogleAuth, EmailAuth, RedditAuth])(
        "handles aggregated login for %p",
        async Provider => {
          const provider = new Provider();
          jest.spyOn(provider, "login").mockImplementation(() =>
            Promise.resolve({
              finalKeyData: { privKey: finalKey },
              oAuthKeyData: { privKey: oAuthKey },
              userInfo: [{ email, name }],
            } as TorusAggregateLoginResponse)
          );

          await expect(provider.getCredentials()).resolves.toEqual({
            secretKey: resultKey,
            name: typeof resultName === "function" ? resultName(provider) : resultName,
          });
        }
      );

      it.each([FacebookAuth, TwitterAuth])("handles login for %p", async Provider => {
        const provider = new Provider();
        jest.spyOn(provider, "login").mockImplementation(() =>
          Promise.resolve({
            finalKeyData: { privKey: finalKey },
            oAuthKeyData: { privKey: oAuthKey },
            userInfo: { email, name },
          } as TorusLoginResponse)
        );

        await expect(provider.getCredentials()).resolves.toEqual({
          secretKey: resultKey,
          name: typeof resultName === "function" ? resultName(provider) : resultName,
        });
      });
    }
  );
});
