import { getRelevantMultisigContracts, multisigsFixture } from "@umami/multisig";
import { makeStore } from "@umami/state";

import { renderHook, waitFor } from "./testUtils";
import { usePollMultisigs } from "./usePollMultisigs";

jest.mock("@umami/multisig", () => ({
  ...jest.requireActual("@umami/multisig"),
  getRelevantMultisigContracts: jest.fn(),
}));

describe("usePollMultisigs", () => {
  it("fetches multisigs and updates the state", async () => {
    const store = makeStore();
    jest.mocked(getRelevantMultisigContracts).mockResolvedValue(multisigsFixture);

    renderHook(() => usePollMultisigs(), { store });

    await waitFor(() => expect(getRelevantMultisigContracts).toHaveBeenCalledTimes(1));

    const expected = [
      { ...multisigsFixture[0], label: "Multisig Account 0", type: "multisig" },
      { ...multisigsFixture[1], label: "Multisig Account 1", type: "multisig" },
      { ...multisigsFixture[2], label: "Multisig Account 2", type: "multisig" },
    ];

    expect(store.getState().multisigs.items).toEqual(expected);
  });
});
