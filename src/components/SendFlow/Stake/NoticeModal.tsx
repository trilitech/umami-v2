import {
  Button,
  Center,
  Checkbox,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { FormPage } from "./FormPage";
import { WarningIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
import { Account } from "../../../types/Account";
import { DynamicModalContext } from "../../DynamicModal";

export const NoticeModal = ({ account }: { account: Account }) => {
  const { openWith } = useContext(DynamicModalContext);
  const { setValue, watch } = useForm<{ consent: boolean }>({
    mode: "onBlur",
    defaultValues: { consent: false },
  });

  const isConsentGiven = !watch("consent");

  return (
    <ModalContent>
      <ModalHeader>
        <ModalCloseButton />
        <Center flexDirection="column" gap="16px">
          <WarningIcon width="24px" height="24px" stroke={colors.gray[450]} />
          <Heading>Disclaimer</Heading>
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
            By staking, you put your balance at risk and may lose all your money.
          </Text>

          <Checkbox
            width="100%"
            background={colors.gray[600]}
            borderRadius="8px"
            onChange={event => setValue("consent", event.target.checked)}
            paddingX="50px"
            paddingY="25px"
          >
            I understand and accept the risks.
          </Checkbox>

          <Button
            width="100%"
            isDisabled={isConsentGiven}
            onClick={() => openWith(<FormPage sender={account} />)}
            size="lg"
          >
            Continue
          </Button>
        </Center>
      </ModalBody>
    </ModalContent>
  );
};
