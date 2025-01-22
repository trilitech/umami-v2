import * as SecureStore from "expo-secure-store";

export const saveToken = async (key: string, value: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.error("Error saving token:", error);
  }
};

export const getToken = async (key: string): Promise<string | null> => {
  try {
    return await SecureStore.getItemAsync(key);
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};
