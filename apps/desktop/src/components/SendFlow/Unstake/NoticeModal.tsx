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
import { type Account } from "../../../types/Account";
import { useGetAccountStakedBalance } from "../../../utils/hooks/stakingHooks";
import { DynamicModalContext } from "../../DynamicModal";
import { NoticeSteps } from "../NoticeSteps";
// TODO: test
export const NoticeModal = ({ account }: { account: Account }) => {
  const { openWith } = useContext(DynamicModalContext);
  const stakedBalance = useGetAccountStakedBalance(account.address.pkh);

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
