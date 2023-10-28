import { extraArgument } from "../utils/redux/extraArgument";
export const fakeExtraArguments = jest.mocked(extraArgument, { shallow: true });
