import { mockToast } from "@umami/state";
import { mockLocalStorage } from "@umami/test-utils";

beforeEach(() => {
  mockLocalStorage();
});

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: () => mockToast,
}));

jest.mock("@walletconnect/core", () => ({
  Core: jest.fn().mockImplementation(config => ({
    projectId: config.projectId,
  })),
}));
jest.mock("@reown/walletkit", () => ({
  WalletKit: jest.fn(),
}));
jest.mock("@walletconnect/utils", () => ({
  WalletConnect: jest.fn(),
}));
