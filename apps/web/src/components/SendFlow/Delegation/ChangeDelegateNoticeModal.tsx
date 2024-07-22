import {
  Button,
  Center,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { DynamicModalContext } from "@umami/components";
import { type Account } from "@umami/core";
import { type TzktAlias } from "@umami/tzkt";
import { useContext } from "react";

import { FormPage } from "./FormPage";
import { StubIcon as WarningIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";

export const ChangeDelegateNoticeModal = ({
  account,
  delegate,
}: {
  account: Account;
  delegate: TzktAlias;
}) => {
  const { openWith } = useContext(DynamicModalContext);
  const color = useColor();

  return (
    <ModalContent>
      <ModalHeader>
        <ModalCloseButton />
        <Center flexDirection="column" gap="16px">
          <WarningIcon width="24px" height="24px" stroke={color("450")} strokeWidth="3" />
          <Heading>Important Notice</Heading>
        </Center>
      </ModalHeader>
      <ModalBody>
        <Center flexDirection="column" gap="32px">
          <Text width="340px" marginTop="10px" color={color("400")} textAlign="center" size="sm">
            Changing the baker will automatically unstake all the existing staked balance. This
            balance will be finalizable after 4 cycles.
          </Text>

          <Button
            width="100%"
            onClick={() =>
              openWith(
                <FormPage
                  form={{ baker: delegate.address, sender: account.address.pkh }}
                  sender={account}
                />
              )
            }
            size="lg"
          >
            I understand
          </Button>
        </Center>
      </ModalBody>
    </ModalContent>
  );
};
