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
import { type Account } from "@umami/core";
import { useContext } from "react";
import { useForm } from "react-hook-form";

import { FormPage } from "./FormPage";
import { WarningIcon } from "../../../assets/icons";
import colors from "../../../style/colors";
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
            Staked balances are locked in your account until they are manually unstaked and
            finalized. You need to wait 4 cycles to finalize after an unstake.
          </Text>

          <Text width="340px" color={colors.gray[400]} textAlign="center" size="sm">
            Staked funds are at risk. You might lose a portion of your stake if the chosen baker is
            slashed for not following Tezos consensus mechanism rules.
          </Text>

          <Checkbox
            width="100%"
            fontWeight={600}
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
