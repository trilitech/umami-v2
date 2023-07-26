import { useModal } from "../../components/useModal";
import SendForm from "../../components/sendForm";
import { SendFormMode } from "../../components/sendForm/types";

export type Options = {
  sender: string;
  recipient?: string;
  mode: SendFormMode;
};

const Component: React.FC<{ params: Options }> = ({ params }) => {
  return <SendForm {...params} />;
};
export const useSendFormModal = () => {
  return useModal(Component);
};
