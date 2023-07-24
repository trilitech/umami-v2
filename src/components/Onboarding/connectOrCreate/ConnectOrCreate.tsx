import { Button, Flex, VStack, Text, Divider, useToast } from "@chakra-ui/react";
import { GoogleAuth } from "../../../GoogleAuth";
import { useRestoreSocial } from "../../../utils/hooks/accountHooks";
import { getPkAndPkhFromSk } from "../../../utils/tezos";
import { SupportedIcons } from "../../CircleIcon";
import ModalContentWrapper from "../ModalContentWrapper";
import { Step, StepType } from "../useOnboardingModal";

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
    <ModalContentWrapper icon={SupportedIcons.wallet} title="Connect or Create Account">
      <VStack w="100%" spacing={4}>
        <Button
          bg="umami.blue"
          w="100%"
          size="lg"
          onClick={_ => goToStep({ type: StepType.notice })}
        >
          Create new Account
        </Button>
        <Button
          variant="outline"
          w="100%"
          size="lg"
          onClick={_ => goToStep({ type: StepType.connectOptions })}
        >
          I already have a wallet
        </Button>
        {
          /* devblock:start */
          <Button
            variant="outline"
            w="100%"
            size="lg"
            onClick={_ => goToStep({ type: StepType.fakeAccount })}
          >
            Add a Fake Account
          </Button>
          /* devblock:end */
        }
        <Flex w="100%" pt="20px" pb="20px">
          <Divider mt="11px" />
          <Text textAlign="center" minW="160px" size="sm" noOfLines={1}>
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
