import { ModalHeader, Text, ModalCloseButton } from "@chakra-ui/react";
import colors from "../../style/colors";

const FormPageHeader = () => {
  return (
    <ModalHeader textAlign="center" p="40px 0 32px 0">
      <Text size="2xl" fontWeight="600">
        Send
      </Text>
      <Text textAlign="center" size="sm" color={colors.gray[400]}>
        Send one or insert into batch.
      </Text>
      <ModalCloseButton />
    </ModalHeader>
  );
};

export default FormPageHeader;
