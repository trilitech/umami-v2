import "@testing-library/jest-native/extend-expect";

import { mockLocalStorage } from "@umami/test-utils";

beforeEach(() =>
  Object.defineProperty(window, "localStorage", {
    value: mockLocalStorage(),
  })
);
