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
import { useDynamicModalContext } from "@umami/components";
import { type Account } from "@umami/core";
import { useGetAccountStakedBalance } from "@umami/state";

import { FormPage } from "./FormPage";
import { StubIcon as WarningIcon } from "../../../assets/icons";
import { useColor } from "../../../styles/useColor";
import { NoticeSteps } from "../NoticeSteps";
// TODO: test
export const NoticeModal = ({ account }: { account: Account }) => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();
  const stakedBalance = useGetAccountStakedBalance(account.address.pkh);

  return (
    <ModalContent>
      <ModalHeader>
        <ModalCloseButton />
        <Center flexDirection="column" gap="16px">
          <WarningIcon width="24px" height="24px" stroke={color("450")} strokeWidth="3" />
          <Heading>Important notice</Heading>
        </Center>
      </ModalHeader>
      <ModalBody>
        <Center flexDirection="column" gap="32px">
          <Text width="340px" marginTop="10px" color={color("400")} textAlign="center" size="sm">
            After submitting an unstake, the chosen amount will become finalizable after 4 cycles
            (~10 days). Then, you will need to finalize unstaked balances in order to make them
            spendable.
          </Text>

          <NoticeSteps steps={["unstake", "finalize"]} />

          <Button
            width="100%"
            onClick={() => openWith(<FormPage sender={account} stakedBalance={stakedBalance} />)}
            size="lg"
          >
            I understand
          </Button>
        </Center>
      </ModalBody>
    </ModalContent>
  );
};
