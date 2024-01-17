import { Button, Divider, Flex, Text, VStack, useToast } from "@chakra-ui/react";

import { WalletPlusIcon } from "../../../assets/icons";
import { GoogleAuth } from "../../../GoogleAuth";
import colors from "../../../style/colors";
import { useRestoreSocial } from "../../../utils/hooks/setAccountDataHooks";
import { useAsyncActionHandler } from "../../../utils/hooks/useAsyncActionHandler";
import { getPkAndPkhFromSk } from "../../../utils/tezos";
import { ModalContentWrapper } from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

export const ConnectOrCreate = ({
  goToStep,
  closeModal,
}: {
  goToStep: (step: Step) => void;
  closeModal: () => void;
}) => {
  const { handleAsyncAction } = useAsyncActionHandler();
  const restoreSocial = useRestoreSocial();
  const toast = useToast();

  const onSocialAuth = (sk: string, email: string) =>
    handleAsyncAction(async () => {
      const { pk, pkh } = await getPkAndPkhFromSk(sk);
      restoreSocial(pk, pkh, email);
      toast({ description: `Successfully added ${email} account`, status: "success" });
      closeModal();
    });

  return (
    <ModalContentWrapper icon={<WalletPlusIcon />} title="Connect or Create Account">
      <VStack width="100%" spacing="16px">
        <Button width="100%" onClick={_ => goToStep({ type: StepType.notice })} size="lg">
          Create a new Account
        </Button>
        <Button
          width="100%"
          onClick={_ => goToStep({ type: StepType.connectOptions })}
          size="lg"
          variant="tertiary"
        >
          I already have a wallet
        </Button>
        {
          /* devblock:start */
          <Button
            width="100%"
            onClick={_ => goToStep({ type: StepType.fakeAccount })}
            size="lg"
            variant="tertiary"
          >
            Add a Fake Account
          </Button>
          /* devblock:end */
        }
        <Flex width="100%" paddingTop="14px" paddingBottom="6px">
          <Divider marginTop="11px" />
          <Text
            minWidth="160px"
            color={colors.gray[400]}
            textAlign="center"
            noOfLines={1}
            size="sm"
          >
            Continue with Google
          </Text>
          <Divider marginTop="11px" />
        </Flex>
        <GoogleAuth onAuth={onSocialAuth} />
      </VStack>
    </ModalContentWrapper>
  );
};
