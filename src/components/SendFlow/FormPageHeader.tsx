import { Heading, ModalCloseButton, ModalHeader, Text, chakra } from "@chakra-ui/react";

import colors from "../../style/colors";

export const HeaderWrapper = chakra(ModalHeader, {
  baseStyle: {
    padding: 0,
    paddingBottom: "32px",
    textAlign: "center",
  },
});

export const FormPageHeader: React.FC<{
  title?: string;
  subTitle?: string;
}> = ({ title = "Send", subTitle = "Send one or insert into batch" }) => {
  return (
    <HeaderWrapper>
      <Heading size="2xl">{title}</Heading>
      <Text marginTop="10px" color={colors.gray[400]} textAlign="center" size="sm">
        {subTitle}
      </Text>
      <ModalCloseButton />
    </HeaderWrapper>
  );
};
