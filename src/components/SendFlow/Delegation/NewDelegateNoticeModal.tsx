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
import { NoticeIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { type Account } from "../../../types/Account";
import { DynamicModalContext } from "../../DynamicModal";
import { NoticeSteps } from "../NoticeSteps";

export const NewDelegateNoticeModal = ({ account }: { account: Account }) => {
  const { openWith } = useContext(DynamicModalContext);

  return (
    <ModalContent>
      <ModalHeader>
        <ModalCloseButton />
        <Center flexDirection="column" gap="16px">
          <NoticeIcon />
          <Heading>Delegation</Heading>
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
            Earn risk-free rewards by delegating to a Tezos baker. Delegated funds remain in your
            account, and you can always spend them at will.
          </Text>

          <NoticeSteps steps={["delegate", "stake tez"]} />

          <Button width="100%" onClick={() => openWith(<FormPage sender={account} />)} size="lg">
            Continue
          </Button>
        </Center>
      </ModalBody>
    </ModalContent>
  );
};
