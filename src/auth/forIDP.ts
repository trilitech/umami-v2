import { EmailAuth } from "./EmailAuth";
import { GoogleAuth } from "./GoogleAuth";
import { RedditAuth } from "./RedditAuth";
import type { IDP } from "./types";

export const forIDP = (idp: IDP) => {
  switch (idp) {
    case "google":
      return new GoogleAuth();
    case "email":
      return new EmailAuth();
    case "reddit":
      return new RedditAuth();
  }
};
