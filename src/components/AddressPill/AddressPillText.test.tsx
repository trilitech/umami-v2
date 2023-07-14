import { mockFA2Address } from "../../mocks/addressKind";
import { render, screen } from "../../mocks/testUtils";
import { formatPkh } from "../../utils/format";
import { contactsActions } from "../../utils/store/contactsSlice";
import { store } from "../../utils/store/store";
import AddressPillText from "./AddressPillText";
const { upsert } = contactsActions;

describe("<AddressPillText />", () => {
  it("AddressPillText shows the name in contact", () => {
    store.dispatch(upsert({ name: "FA2Name", pkh: mockFA2Address.pkh }));
    render(<AddressPillText addressKind={mockFA2Address} showPkh={false} />);

    expect(screen.getByText("FA2Name")).toBeInTheDocument();
  });

  it("AddressPillText shows the formatted pkh with showPkh=true", () => {
    store.dispatch(upsert({ name: "FA2Name", pkh: mockFA2Address.pkh }));
    render(<AddressPillText addressKind={mockFA2Address} showPkh={true} />);
    expect(screen.getByText(formatPkh(mockFA2Address.pkh))).toBeInTheDocument();
  });

  it("AddressPillText shows lable", () => {
    render(
      <AddressPillText addressKind={{ ...mockFA2Address, label: "FA2Label" }} showPkh={false} />
    );
    expect(screen.getByText("FA2Label")).toBeInTheDocument();
  });

  it("AddressPillText fallbacks to formatted pkh", () => {
    render(<AddressPillText addressKind={mockFA2Address} showPkh={false} />);
    expect(screen.getByText(formatPkh(mockFA2Address.pkh))).toBeInTheDocument();
  });
});
