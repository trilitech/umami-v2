import { mock } from "jest-mock-extended";
import * as tezosUtils from "../utils/tezos";

export const fakeTezosUtils = mock<typeof tezosUtils>(tezosUtils);
