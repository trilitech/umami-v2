import { type RawPkh } from "@umami/tezos";

export const fakeIsAccountRevealed = (revealedKeyPairs: { pkh: RawPkh }[]) => (pkh: RawPkh) =>
  Promise.resolve(revealedKeyPairs.map(keyPair => keyPair.pkh).includes(pkh));
