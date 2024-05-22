import { EmailAuth } from "./EmailAuth";
import { FacebookAuth } from "./FacebookAuth";
import { GoogleAuth } from "./GoogleAuth";
import { RedditAuth } from "./RedditAuth";
import { TwitterAuth } from "./TwitterAuth";
import type { IDP } from "./types";

/**
 * Returns the Auth instance for the given IDP
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
  }
};
