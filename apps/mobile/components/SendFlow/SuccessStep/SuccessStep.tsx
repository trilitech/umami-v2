import { Check, ExternalLink } from "@tamagui/lucide-icons";
import { useSelectedNetwork } from "@umami/state";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { Button, Dialog, Text, YStack } from "tamagui";

type SuccessStepProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hash: string;
};

export const SuccessStep = ({ open, onOpenChange, hash }: SuccessStepProps) => {
  const network = useSelectedNetwork();
  const router = useRouter();
  const tzktUrl = `${network.tzktExplorerUrl}/${hash}`;

  const handleViewOperations = () => {
    onOpenChange(false);
    router.push("/home");
  };

  const handleViewInTzkt = async () => {
    await Linking.openURL(tzktUrl);
  };

  return (
    <Dialog modal onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Overlay key="overlay" />

        <Dialog.Content
          key="content"
          padding="$4"
          animation="quick"
          bordered
          elevate
          enterStyle={{ opacity: 0, scale: 0.95 }}
          exitStyle={{ opacity: 0, scale: 0.95 }}
        >
          <YStack alignItems="center" space="$4">
            <Check color="$green10" size={24} />

            <Dialog.Title textAlign="center" size="$8">
              Operation Submitted
            </Dialog.Title>

            <Text color="$gray11" textAlign="center" size="$5">
              You can follow this operation's progress in the Operations section.{"\n"}
              It may take up to 30 seconds to appear.
            </Text>

            <YStack width="100%" space="$3">
              <Button onPress={handleViewOperations} size="$4" theme="active">
                See all Operations
              </Button>

              <Button icon={ExternalLink} onPress={handleViewInTzkt} size="$4" variant="outlined">
                View in TzKT
              </Button>
            </YStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};
