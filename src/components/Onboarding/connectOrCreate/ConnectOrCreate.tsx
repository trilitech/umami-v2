import { Button, Flex, VStack, Text, Divider, useToast } from "@chakra-ui/react";
import { GoogleAuth } from "../../../GoogleAuth";
import { useRestoreSocial } from "../../../utils/hooks/accountHooks";
import { getPkAndPkhFromSk } from "../../../utils/tezos";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";
import WalletPlusIcon from "../../../assets/icons/WalletPlus";
import colors from "../../../style/colors";

const ConnectOrCreate = ({
  goToStep,
  closeModal,
}: {
  goToStep: (step: Step) => void;
  closeModal: () => void;
}) => {
  const restoreSocial = useRestoreSocial();
  const toast = useToast();

  const onSuccessfulSocialAuth = async (sk: string, email: string) => {
    const { pk, pkh } = await getPkAndPkhFromSk(sk);
    restoreSocial(pk, pkh, email);
    toast({ title: `Successfully added ${email} account`, status: "success" });
    closeModal();
  };
  return (
    <ModalContentWrapper icon={<WalletPlusIcon />} title="Connect or Create Account">
      <VStack w="100%" spacing="16px">
        <Button w="100%" size="lg" onClick={_ => goToStep({ type: StepType.notice })}>
          Create new Account
        </Button>
        <Button
          variant="tertiary"
          w="100%"
          size="lg"
          onClick={_ => goToStep({ type: StepType.connectOptions })}
        >
          I already have a wallet
        </Button>
        {
          /* devblock:start */
          <Button
            variant="tertiary"
            w="100%"
            size="lg"
            onClick={_ => goToStep({ type: StepType.fakeAccount })}
          >
            Add a Fake Account
          </Button>
          /* devblock:end */
        }
        <Flex w="100%" pt="14px" pb="6px">
          <Divider mt="11px" />
          <Text textAlign="center" minW="160px" size="sm" noOfLines={1} color={colors.gray[400]}>
            Continue with Google
          </Text>
          <Divider mt="11px" />
        </Flex>
        <GoogleAuth onSuccessfulAuth={onSuccessfulSocialAuth} />
      </VStack>
    </ModalContentWrapper>
  );
};

export default ConnectOrCreate;
