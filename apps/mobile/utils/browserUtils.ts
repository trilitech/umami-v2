import * as WebBrowser from "expo-web-browser";

export const openBrowser = async (link: string): Promise<void> => {
  try {
    await WebBrowser.openBrowserAsync(link);
  } catch (error) {
    console.error("Error opening browser:", error);
  }
};
