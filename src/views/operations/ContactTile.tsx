import { MdPersonAddAlt } from "react-icons/md";
import { TextAndIconBtn } from "../../components/TextAndIconBtn";
import { formatPkh, truncate } from "../../utils/format";
import { useUpsertContactModal } from "../home/useUpsertContactModal";
import { Box, Text } from "@chakra-ui/react";
import { FC } from "react";

const ContactTile: FC<{
  pkh: string;
  getNameFromAddress: (pkh: string) => string | null;
}> = ({ pkh, getNameFromAddress }) => {
  const name = getNameFromAddress(pkh);
  const { modalElement, onOpen } = useUpsertContactModal();

  return (
    <Box data-testid="contact-tile">
      {name ? (
        <Text size="sm">{truncate(name, 20)}</Text>
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

export default ContactTile;
