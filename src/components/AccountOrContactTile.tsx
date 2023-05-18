import { MdPersonAddAlt } from "react-icons/md";
import { FC } from "react";
import { useUpsertContactModal } from "../views/home/useUpsertContactModal";
import { formatPkh, truncate } from "../utils/format";
import { TextAndIconBtn } from "./TextAndIconBtn";
import { useGetContractName } from "../utils/hooks/contactsHooks";
import { useGetAccount } from "../utils/hooks/accountHooks";
import { Box, Text } from "@chakra-ui/react";

export const ContactTile: FC<{
  pkh: string;
  contactName: string | null;
}> = ({ pkh, contactName }) => {
  const { modalElement, onOpen } = useUpsertContactModal();

  return (
    <Box data-testid="contact-tile">
      {contactName ? (
        <Text size="sm">{truncate(contactName, 20)}</Text>
      ) : (
        <TextAndIconBtn
          text={formatPkh(pkh)}
          icon={MdPersonAddAlt}
          onClick={() => {
            onOpen({ contactToDisplay: { name: "", pkh }, isEdit: true });
          }}
        />
      )}

      {modalElement}
    </Box>
  );
};

const AccountOrContactTile: React.FC<{ pkh: string }> = ({ pkh }) => {
  const getContactName = useGetContractName();
  const getAccount = useGetAccount();

  const account = getAccount(pkh);

  if (account) {
    return <Text data-testid="account-or-contact-tile">{account.label}</Text>;
  }

  return <ContactTile pkh={pkh} contactName={getContactName(pkh)} />;
};

export default AccountOrContactTile;
