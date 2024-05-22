import { EmailAuth } from "./EmailAuth";
import { FacebookAuth } from "./FacebookAuth";
import { forIDP } from "./forIDP";
import { GoogleAuth } from "./GoogleAuth";
import { RedditAuth } from "./RedditAuth";
import { TwitterAuth } from "./TwitterAuth";

describe("forIDP", () => {
  it.each([
    { idp: "google" as const, provider: GoogleAuth },
    { idp: "facebook" as const, provider: FacebookAuth },
    { idp: "reddit" as const, provider: RedditAuth },
    { idp: "twitter" as const, provider: TwitterAuth },
    { idp: "email" as const, provider: EmailAuth },
  ])("creates an instance for the $idp IDP", ({ idp, provider }) => {
    expect(forIDP(idp)).toBeInstanceOf(provider);
  });
});
