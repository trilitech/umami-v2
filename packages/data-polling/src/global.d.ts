export {};

declare global {
  interface Window {
    electronAPI?: {
      onBackupData: (fn: (event: any, data?: Record<string, string>) => void) => void;
    };
  }
}
