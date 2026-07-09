---
name: release-desktop
description: Release a new version of the Umami desktop app — version bump PR, tag, and the signing/release CI. Use when asked to bump the desktop version or cut a release.
---

# Releasing the desktop app

## Process

1. **Bump version**: edit `version` in `apps/desktop/package.json` only (see commit `cfa18784c` "Bump desktop to 2.3.8" — a one-line change). Open it as a normal PR to `main`.
2. **Tag**: after merge, a `v*.*.*` tag (e.g. `v2.3.8`) pushed to the repo triggers `.github/workflows/release.yaml`.
3. **CI release job**: builds the desktop app on separate Linux and macOS runners, signs binaries (macOS: DMG/ZIP with Apple team ID from `apps/desktop/electron-builder.yml`; Linux: DEB/RPM; Windows: APPX), and creates a **draft** GitHub release — someone must publish it manually.

## Local packaging (for verification)

```bash
cd apps/desktop
pnpm build                        # vite build to build/
pnpm electron:package:mac         # or :mac:debug (devtools), :win, :linux
```

Packaging config: `apps/desktop/electron-builder.yml` (targets, entitlements, GitHub publish settings).

## Notes

- Only the desktop app is versioned/released this way; web and embed-iframe deploy via Vercel, mobile via EAS/Expo.
- Don't create tags without being asked — tag push immediately kicks off the signing pipeline.
