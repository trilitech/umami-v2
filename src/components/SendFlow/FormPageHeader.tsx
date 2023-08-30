import { ModalHeader, Text, ModalCloseButton, chakra } from "@chakra-ui/react";
import colors from "../../style/colors";

export const HeaderWrapper = chakra(ModalHeader, {
  baseStyle: {
    p: "40px 0 32px 0",
    textAlign: "center",
  },
});

const FormPageHeader: React.FC<{
  title?: string;
  subTitle?: string;
}> = ({ title = "Send", subTitle = "Send one or insert into batch" }) => {
  return (
    <HeaderWrapper>
      <Text size="2xl" fontWeight="600">
        {title}
      </Text>
      <Text textAlign="center" size="sm" color={colors.gray[400]}>
        {subTitle}
      </Text>
      <ModalCloseButton />
    </HeaderWrapper>
  );
};

export default FormPageHeader;
