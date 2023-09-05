import { ModalHeader, Text, ModalCloseButton, chakra } from "@chakra-ui/react";
import colors from "../../style/colors";

export const HeaderWrapper = chakra(ModalHeader, {
  baseStyle: {
    padding: 0,
    paddingBottom: "32px",
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
