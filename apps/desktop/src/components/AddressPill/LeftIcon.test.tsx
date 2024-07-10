import { mockContractAddress } from "@umami/tezos";

import { LeftIcon } from "./LeftIcon";
import { render, screen } from "../../mocks/testUtils";

describe("<LeftIcon />", () => {
  it.each(["multisig", "fa1.2", "fa2", "baker", "contact"] as const)(
    "renders %s left icon",
    type => {
      render(
        <LeftIcon
          addressKind={{
            type,
            pkh: mockContractAddress(0).pkh,
            label: "label" as any,
          }}
        />
      );

      expect(screen.getByTestId(`${type}-icon`)).toBeInTheDocument();
    }
  );

  it.each(["ledger", "social", "secret_key", "social", "unknown"])("returns null for %s", type => {
    render(
      <LeftIcon
        addressKind={{
          type: type as any,
          pkh: mockContractAddress(0).pkh,
          label: "label",
        }}
      />
    );

    expect(screen.queryByTestId(/-icon$/)).not.toBeInTheDocument();
  });
});
