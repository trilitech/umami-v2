import { type IDP } from "@umami/social-auth";

import { AppleAuth } from "./AppleAuth";
import { FacebookAuth } from "./FacebookAuth";
import { GoogleAuth } from "./GoogleAuth";
import { RedditAuth } from "./RedditAuth";
import { TwitterAuth } from "./TwitterAuth";

/**
 * Returns the Auth instance for the given IDP and redirect surface.
 *
 * @param idp - The Identity Provider to create an Auth instance for.
 */
export const forIDP = (idp: IDP) => {
  switch (idp) {
    case "google":
      return new GoogleAuth();
    case "email":
      throw new Error("Email auth is not supported on mobile");

    // TODO: Implement email auth for mobile
    // return new EmailAuth();
    case "reddit":
      return new RedditAuth();
    case "facebook":
      return new FacebookAuth();
    case "twitter":
      return new TwitterAuth();
    case "apple":
      return new AppleAuth();
    default:
      throw new Error(`Unsupported IDP: ${idp}`);
  }
};
