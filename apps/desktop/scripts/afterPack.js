const path = require("path");
const { flipFuses, FuseVersion, FuseV1Options } = require("@electron/fuses");
const builder = require("electron-builder");
const process = require("process");

// taken from https://github.com/electron-userland/electron-builder/issues/6365#issuecomment-1526262846
module.exports = async function afterPack(
  /** @type {import("electron-builder").AfterPackContext}  */
  context
) {
  // skip flipping fuses for the debug build
  if (process.env.DEBUG === "true") {
    return;
  }
  const {
    electronPlatformName,
    packager: {
      appInfo: { productFilename },
    },
    arch,
  } = context;

  let executableName, ext;
  switch (electronPlatformName) {
    case "linux": {
      executableName = "@umamidesktop";
      ext = "";
      break;
    }
    case "darwin": {
      executableName = "Umami";
      ext = ".app";
      break;
    }
    case "win32": {
      executableName = "Umami";
      ext = ".exe";
    }
  }

  const electronBinaryPath = path.join(context.appOutDir, `${executableName}${ext}`);

  await flipFuses(electronBinaryPath, {
    version: FuseVersion.V1,
    resetAdHocDarwinSignature: electronPlatformName === "darwin" && arch === builder.Arch.arm64,
    strictlyRequireAllFuses: true,
    [FuseV1Options.RunAsNode]: false,
    [FuseV1Options.EnableCookieEncryption]: true,
    [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
    [FuseV1Options.EnableNodeCliInspectArguments]: false,
    [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
    [FuseV1Options.OnlyLoadAppFromAsar]: true,
    [FuseV1Options.LoadBrowserProcessSpecificV8Snapshot]: false,
    [FuseV1Options.GrantFileProtocolExtraPrivileges]: false,
  });
};
