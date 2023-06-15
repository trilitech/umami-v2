const { notarize } = require("electron-notarize");

exports.default = async function notarizing(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== "darwin") {
    return;
  }
  if (process.env.CSC_IDENTITY_AUTO_DISCOVERY === "false") {
    console.log("skipping notarizing because of CSC_IDENTITY_AUTO_DISCOVERY=false");
    return;
  }
  console.log("Notarizing");

  const appName = context.packager.appInfo.productFilename;

  return await notarize({
    appBundleId: "com.trilitech.umami",
    appPath: `${appOutDir}/${appName}.app`,
    appleId: process.env.APPLEID,
    appleIdPassword: process.env.APPLEIDPASS,
  });
};
