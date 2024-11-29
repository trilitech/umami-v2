import { useEffect, useRef } from "react";
import { decryptV1 } from "@umami/crypto-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRestoreFromMnemonic } from "@umami/state";

const password = "Password123$"; // TODO: ask the user for the password (or biometrics access to their keychain)

export const ImportOldAccounts = () => {
  const restoreFromMnemonic = useRestoreFromMnemonic();
  const processing = useRef(false); // prevents concurrent account restoration

  useEffect(() => {
    (async () => {
      if (processing.current) {
        return;
      }
      processing.current = true;
      try {
        const backupPhrase = await AsyncStorage.getItem("backupPhrase");
        if (!backupPhrase) {
          return;
        }
        let derivationPathTemplate = await AsyncStorage.getItem("derivationPath");

        if (!derivationPathTemplate) {
          derivationPathTemplate = "m/44'/1729'/?'/0'";
        }

        const mnemonic = await decryptV1(JSON.parse(backupPhrase), password);
        await restoreFromMnemonic({
          mnemonic,
          password,
          derivationPathTemplate,
          label: "Account",
          curve: "ed25519",
        });
        await AsyncStorage.setItem("_backupPhrase", backupPhrase);
        await AsyncStorage.removeItem("backupPhrase");
      } catch (e) {
        console.warn(e);
      } finally {
        processing.current = false;
      }
    })();
  }, [restoreFromMnemonic]);

  return "";
};
