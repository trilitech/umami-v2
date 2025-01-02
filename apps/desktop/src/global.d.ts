export {};

declare global {
  interface Window {
    electronAPI: {
      clipboardWriteText: (text: string) => void;
      clipboardClear: () => void;
      onDeeplink: (callback: (url: string) => void) => void;
      onAppUpdateDownloaded: (callback: () => void) => void;
      installAppUpdateAndQuit: () => void;
      getBackupData: () => Promise<Record<string, string> | undefined>;
    };
  }
}
