import { mockDeep } from "jest-mock-extended";

// It looks like mock only works on modules
// Can we make this simpler?
import { extraArgument } from "../utils/store/extraArgument";

export const fakeModule =
  mockDeep < typeof { extraArgument } > { extraArgument };

export const fakeExtraArguments = fakeModule.extraArgument;
