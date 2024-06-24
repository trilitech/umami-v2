import { EmailAuth } from "./EmailAuth";
import { FacebookAuth } from "./FacebookAuth";
import { GoogleAuth } from "./GoogleAuth";
import { RedditAuth } from "./RedditAuth";
import { TwitterAuth } from "./TwitterAuth";
import type { IDP, RedirectSurface } from "./types";

/**
 * Returns the Auth instance for the given IDP and redirect surface.
 */
export const forIDP = (idp: IDP, redirectSurface: RedirectSurface) => {
  switch (idp) {
    case "google":
      return new GoogleAuth(redirectSurface);
    case "email":
      return new EmailAuth(redirectSurface);
    case "reddit":
      return new RedditAuth(redirectSurface);
    case "facebook":
      return new FacebookAuth(redirectSurface);
    case "twitter":
      return new TwitterAuth(redirectSurface);
  }
};
