// TODO: check if needed
import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

import { resetStore } from "@umami/state";
import { mockToast } from "@umami/test-utils";

beforeEach(() => {
  Object.defineProperties(global, {
    crypto: { value: webcrypto, writable: true },
    TextDecoder: { value: TextDecoder, writable: true },
    TextEncoder: { value: TextEncoder, writable: true },
  });
  resetStore();
});

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: () => mockToast,
}));
