import { type TorusAggregateLoginResponse, type TorusLoginResponse } from "@toruslabs/customauth";

import { EmailAuth } from "./EmailAuth";
import { FacebookAuth } from "./FacebookAuth";
import { GoogleAuth } from "./GoogleAuth";
import { RedditAuth } from "./RedditAuth";
import { TwitterAuth } from "./TwitterAuth";
import { type RedirectSurface } from "./types";

const rawSecretKey = "ad02df00ce58f9e3e1ff882661edbfa4e5a31b9ebceaa4e3e1fe810fb2ba38f2";
const secretKey = "spsk2jm29sHC99HDi64VBpSwEMZRQ7WfHdvQPVMZCkyWyR4spBrtRW";

const redirectSurfaces: RedirectSurface[] = ["desktop", "embed"];

describe("Auth", () => {
  const testCases = [
    {
      finalKey: rawSecretKey,
      oAuthKey: rawSecretKey,
      email: "some email",
      name: "some name",
      profileImage: "some image url",
      verifierId: "some id",
      resultKey: secretKey,
      resultId: "some id",
    },
    {
      finalKey: rawSecretKey,
      oAuthKey: rawSecretKey,
      email: undefined,
      name: "some name",
      profileImage: "some image url",
      verifierId: undefined,
      resultKey: secretKey,
      resultId: "some name",
    },
    {
      finalKey: rawSecretKey,
      oAuthKey: rawSecretKey,
      email: undefined,
      name: undefined,
      profileImage: "some image url",
      verifierId: "some id",
      resultKey: secretKey,
      resultId: "some id",
    },
    {
      finalKey: rawSecretKey,
      oAuthKey: rawSecretKey + "some extra",
      email: undefined,
      name: undefined,
      profileImage: "some image url",
      verifierId: "some id",
      resultKey: secretKey,
      resultId: "some id",
    },
    {
      finalKey: undefined,
      oAuthKey: rawSecretKey,
      email: "some email",
      name: "some name",
      profileImage: "some image url",
      verifierId: undefined,
      resultKey: secretKey,
      resultId: "some name",
    },
  ];

  describe.each(testCases)(
    "for $finalKey, $oAuthKey, $email, $name",
    ({ finalKey, oAuthKey, email, name, profileImage, verifierId, resultKey, resultId }) => {
      describe.each(redirectSurfaces)("for %s surface", redirectSurface => {
        it.each([GoogleAuth, EmailAuth, RedditAuth])(
          "handles aggregated login for %p",
          async Provider => {
            const provider = new Provider(redirectSurface);
            jest.spyOn(provider, "login").mockImplementation(() =>
              Promise.resolve({
                finalKeyData: { privKey: finalKey },
                oAuthKeyData: { privKey: oAuthKey },
                userInfo: [{ email, name, profileImage, verifierId }],
              } as TorusAggregateLoginResponse)
            );

            await expect(provider.getCredentials()).resolves.toEqual({
              secretKey: resultKey,
              id: resultId,
              email,
              name,
              imageUrl: profileImage,
            });
          }
        );

        it.each([FacebookAuth, TwitterAuth])("handles login for %p", async Provider => {
          const provider = new Provider(redirectSurface);
          jest.spyOn(provider, "login").mockImplementation(() =>
            Promise.resolve({
              finalKeyData: { privKey: finalKey },
              oAuthKeyData: { privKey: oAuthKey },
              userInfo: { email, name, profileImage, verifierId },
            } as TorusLoginResponse)
          );

          await expect(provider.getCredentials()).resolves.toEqual({
            secretKey: resultKey,
            id: resultId,
            email,
            name,
            imageUrl: profileImage,
          });
        });
      });
    }
  );
});
