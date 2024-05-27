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
import { useContext } from "react";

import { FormPage } from "./FormPage";
import { WarningIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { Account } from "../../../types/Account";
import { TzktAlias } from "../../../types/Address";
import { DynamicModalContext } from "../../DynamicModal";

export const ChangeDelegateNoticeModal = ({
  account,
  delegate,
}: {
  account: Account;
  delegate: TzktAlias;
}) => {
  const { openWith } = useContext(DynamicModalContext);

  return (
    <ModalContent>
      <ModalHeader>
        <ModalCloseButton />
        <Center flexDirection="column" gap="16px">
          <WarningIcon width="24px" height="24px" stroke={colors.gray[450]} strokeWidth="3" />
          <Heading>Important Notice</Heading>
        </Center>
      </ModalHeader>
      <ModalBody>
        <Center flexDirection="column" gap="32px">
          <Text
            width="340px"
            marginTop="10px"
            color={colors.gray[400]}
            textAlign="center"
            size="sm"
          >
            Changing the baker after staking will unstake your staked balance. You will need to
            finalise the unstake balance first before staking it to the new baker.
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
