import { Heading, ModalHeader } from "@chakra-ui/react";

import { ModalCloseButton } from "../CloseButton";

export const FormPageHeader = ({
  title = "Send",
  subTitle: _subTitle,
}: {
  title?: string;
  subTitle?: string;
}) => (
  <ModalHeader>
    <Heading size="xl">{title}</Heading>
    <ModalCloseButton />
  </ModalHeader>
);
