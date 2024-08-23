import { Flex, Link } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";

import { EmptyMessage, type EmptyMessageProps } from "./EmptyMessage";
import { useColor } from "../../styles/useColor";
import { VerificationInfoModal } from "../Onboarding/VerificationInfoModal";

export const VerifyMessage = ({ ...props }: Omit<EmptyMessageProps, "title">) => {
  const { openWith } = useDynamicModalContext();
  const color = useColor();

  return (
    <Flex alignItems="center" flexDirection="column" margin="auto">
      <EmptyMessage
        cta="Verify Now"
        onClick={() => console.log("Verify Now")}
        subtitle={
          "Please verify your account, to unlock all features\n and keep your account secure."
        }
        title="Verify Your Account"
        {...props}
      />
      <Link
        marginTop="16px"
        color={color("600")}
        fontSize="12px"
        onClick={() => openWith(<VerificationInfoModal />)}
        textDecor="underline"
      >
        How does verification work?
      </Link>
    </Flex>
  );
};
