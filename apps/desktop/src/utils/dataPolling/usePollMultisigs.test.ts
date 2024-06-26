import { getRelevantMultisigContracts, multisigsFixture } from "@umami/multisig";
import { store } from "@umami/state";

import { usePollMultisigs } from "./usePollMultisigs";
import { renderHook, waitFor } from "../../mocks/testUtils";

jest.mock("@umami/multisig", () => ({
  ...jest.requireActual("@umami/multisig"),
  getRelevantMultisigContracts: jest.fn(),
}));

describe("usePollMultisigs", () => {
  it("fetches multisigs and updates the state", async () => {
    jest.mocked(getRelevantMultisigContracts).mockResolvedValue(multisigsFixture);

    renderHook(() => usePollMultisigs());

    await waitFor(() => expect(getRelevantMultisigContracts).toHaveBeenCalledTimes(1));

    const expected = [
      { ...multisigsFixture[0], label: "Multisig Account 0", type: "multisig" },
      { ...multisigsFixture[1], label: "Multisig Account 1", type: "multisig" },
      { ...multisigsFixture[2], label: "Multisig Account 2", type: "multisig" },
    ];

    expect(store.getState().multisigs.items).toEqual(expected);
  });
});
