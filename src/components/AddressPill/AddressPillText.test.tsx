import { mockFA2Address } from "../../mocks/addressKind";
import { render, screen } from "../../mocks/testUtils";
import { formatPkh } from "../../utils/format";
import { contactsActions } from "../../utils/store/contactsSlice";
import { store } from "../../utils/store/store";
import AddressPillText from "./AddressPillText";
const { reset, upsert } = contactsActions;
beforeEach(() => {
  store.dispatch(reset());
});
describe("<AddressPillText />", () => {
  test("AddressPillText shows the name in contact", () => {
    store.dispatch(upsert({ name: "FA2Name", pkh: mockFA2Address.pkh }));
    render(<AddressPillText addressKind={mockFA2Address} showPkh={false} />);

    expect(screen.getByText("FA2Name")).toBeInTheDocument();
  });

  test("AddressPillText shows the formatted pkh with showPkh=true", () => {
    store.dispatch(upsert({ name: "FA2Name", pkh: mockFA2Address.pkh }));
    render(<AddressPillText addressKind={mockFA2Address} showPkh={true} />);
    expect(screen.getByText(formatPkh(mockFA2Address.pkh))).toBeInTheDocument();
  });

  test("AddressPillText shows lable", () => {
    render(
      <AddressPillText addressKind={{ ...mockFA2Address, label: "FA2Label" }} showPkh={false} />
    );
    expect(screen.getByText("FA2Label")).toBeInTheDocument();
  });

  test("AddressPillText fallbacks to formatted pkh", () => {
    render(<AddressPillText addressKind={mockFA2Address} showPkh={false} />);
    expect(screen.getByText(formatPkh(mockFA2Address.pkh))).toBeInTheDocument();
  });
});
