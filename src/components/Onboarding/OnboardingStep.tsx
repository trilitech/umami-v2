export type OnboardingStep =
  | EulaStep
  | ConnectOrCreateStep
  | NoticeStep
  | ConnectOptionsStep
  | ShowSeedphraseStep
  | RestoreSeedphraseStep
  | RestoreSecretKeyStep
  | VerifySeedphraseStep
  | NameAccountStep
  | DerivationPathStep
  | RestoreLedgerStep
  | RestoreBackupStep
  | MasterPasswordStep
  | FakeAccountStep;

type EulaStep = { type: "eula" };
type ConnectOrCreateStep = { type: "connectOrCreate" };
type NoticeStep = { type: "notice" };
type ConnectOptionsStep = { type: "connectOptions" };
export type ShowSeedphraseStep = {
  type: "showSeedphrase";
  account: { type: "mnemonic"; mnemonic: string };
};
type RestoreSeedphraseStep = { type: "restoreMnemonic" };
type RestoreSecretKeyStep = { type: "restoreSecretKey" };
export type VerifySeedphraseStep = {
  type: "verifySeedphrase";
  account: { type: "mnemonic"; mnemonic: string };
};
export type NameAccountStep = {
  type: "nameAccount";
  account:
    | { type: "mnemonic"; mnemonic: string }
    | { type: "ledger" }
    | { type: "secret_key"; secretKey: string };
};
export type DerivationPathStep = {
  type: "derivationPath";
  account:
    | { type: "mnemonic"; mnemonic: string; label: string }
    | { type: "ledger"; label: string };
};
export type RestoreLedgerStep = {
  type: "restoreLedger";
  account: {
    type: "ledger";
    label: string;
    derivationPathTemplate?: string;
    derivationPath?: string;
  };
};
type RestoreBackupStep = {
  type: "restoreBackup";
};
export type MasterPasswordStep = {
  type: "masterPassword";
  account:
    | { type: "mnemonic"; mnemonic: string; label: string; derivationPathTemplate: string }
    | { type: "secret_key"; secretKey: string; label: string };
};
type FakeAccountStep = { type: "fakeAccount" };
