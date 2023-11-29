import { mockFA2Address } from "../../mocks/addressKind";
import { mockImplicitAddress } from "../../mocks/factories";
import { render, screen } from "../../mocks/testUtils";
import { formatPkh } from "../../utils/format";
import { contactsActions } from "../../utils/redux/slices/contactsSlice";
import store from "../../utils/redux/store";
import AddressPillText from "./AddressPillText";
const { upsert } = contactsActions;

describe("<AddressPillText />", () => {
  it("shows the name in contact", () => {
    store.dispatch(upsert({ name: "FA2Name", pkh: mockFA2Address.pkh }));
    render(<AddressPillText addressKind={mockFA2Address} showPkh={false} />);

    expect(screen.getByText("FA2Name")).toBeInTheDocument();
  });

  it("shows the formatted pkh with showPkh=true", () => {
    store.dispatch(upsert({ name: "FA2Name", pkh: mockFA2Address.pkh }));
    render(<AddressPillText addressKind={mockFA2Address} showPkh={true} />);
    expect(screen.getByText(formatPkh(mockFA2Address.pkh))).toBeInTheDocument();
  });

  it("shows label", () => {
    render(
      <AddressPillText
        addressKind={{
          type: "implicit",
          pkh: mockImplicitAddress(0).pkh,
          label: "Some label",
        }}
        showPkh={false}
      />
    );
    expect(screen.getByText("Some label")).toBeInTheDocument();
  });

  it("shows alias", () => {
    render(<AddressPillText addressKind={mockFA2Address} alias="test alias" showPkh={false} />);
    expect(screen.getByText("test alias")).toBeInTheDocument();
  });

  it("fallbacks to formatted pkh without fallback text", () => {
    render(<AddressPillText addressKind={mockFA2Address} showPkh={false} />);
    expect(screen.getByText(formatPkh(mockFA2Address.pkh))).toBeInTheDocument();
  });
});
