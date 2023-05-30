import { mockDeep } from "jest-mock-extended";

// It looks like mock only works on modules
// Can we make this simpler?
import * as module from "../utils/store/extraArgument";

export const fakeModule = mockDeep<typeof module>(module);

export const fakeExtraArguments = fakeModule.extraArgument;
