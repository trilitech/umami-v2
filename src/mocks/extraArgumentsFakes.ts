import { extraArgument } from "../utils/store/extraArgument";

const restoreAccountMock = extraArgument.restoreAccount as jest.Mock;
const decryptMock = extraArgument.decrypt as jest.Mock;
const restoreMnemonicAccountsMock =
  extraArgument.restoreMnemonicAccounts as jest.Mock;
const encryptMock = extraArgument.encrypt as jest.Mock;

export const extraArgumentFake = {
  restoreAccount: restoreAccountMock,
  decrypt: decryptMock,
  restoreMnemonicAccounts: restoreMnemonicAccountsMock,
  encryptMock,
};
