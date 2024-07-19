import { Heading, ModalCloseButton, ModalHeader, Text, chakra } from "@chakra-ui/react";

import { useColor } from "../../styles/useColor";

export const HeaderWrapper = chakra(ModalHeader, {
  baseStyle: {
    padding: 0,
    paddingBottom: "32px",
    textAlign: "center",
  },
});

export const FormPageHeader = ({
  title = "Send",
  subTitle = "Send one or insert into batch",
}: {
  title?: string;
  subTitle?: string;
}) => {
  const color = useColor();

  return (
    <HeaderWrapper>
      <Heading size="2xl">{title}</Heading>
      <Text marginTop="10px" color={color("400")} textAlign="center" size="sm">
        {subTitle}
      </Text>
      <ModalCloseButton />
    </HeaderWrapper>
  );
};
