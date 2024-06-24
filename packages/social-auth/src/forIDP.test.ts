import { EmailAuth } from "./EmailAuth";
import { FacebookAuth } from "./FacebookAuth";
import { forIDP } from "./forIDP";
import { GoogleAuth } from "./GoogleAuth";
import { RedditAuth } from "./RedditAuth";
import { TwitterAuth } from "./TwitterAuth";
import { type RedirectSurface } from "./types";

const redirectSurfaces: RedirectSurface[] = ["desktop", "embed"];

describe.each(redirectSurfaces)("for %s surface", redirectSurface => {
  it.each([
    { idp: "google" as const, provider: GoogleAuth },
    { idp: "facebook" as const, provider: FacebookAuth },
    { idp: "reddit" as const, provider: RedditAuth },
    { idp: "twitter" as const, provider: TwitterAuth },
    { idp: "email" as const, provider: EmailAuth },
  ])("creates an instance for the $idp IDP", ({ idp, provider }) => {
    expect(forIDP(idp, redirectSurface)).toBeInstanceOf(provider);
  });
});
