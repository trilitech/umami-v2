import { mockToast } from "@umami/test-utils";
import { resetStore } from "./store";
import { webcrypto } from "crypto";
import { TextDecoder, TextEncoder } from "util";

Object.defineProperties(global, {
  crypto: { value: webcrypto, writable: true },
  TextDecoder: { value: TextDecoder, writable: true },
  TextEncoder: { value: TextEncoder, writable: true },
});

jest.mock("@chakra-ui/react", () => ({
  ...jest.requireActual("@chakra-ui/react"),
  useToast: () => mockToast,
}));

beforeEach(() => resetStore());
