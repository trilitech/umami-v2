import { EmailAuth } from "./EmailAuth";
import { FacebookAuth } from "./FacebookAuth";
import { GoogleAuth } from "./GoogleAuth";
import { RedditAuth } from "./RedditAuth";
import { TwitterAuth } from "./TwitterAuth";
import type { IDP } from "./types";

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
      return new EmailAuth();
    case "reddit":
      return new RedditAuth();
    case "facebook":
      return new FacebookAuth();
    case "twitter":
      return new TwitterAuth();
    case "apple":
      throw new Error("Apple Auth is not supported yet");
  }
};
