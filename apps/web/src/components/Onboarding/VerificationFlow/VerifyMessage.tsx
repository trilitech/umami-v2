import { Flex, Link } from "@chakra-ui/react";
import { useDynamicModalContext } from "@umami/components";

import { useHandleVerify } from "./useHandleVerify";
import { VerificationInfoModal } from "./VerificationInfoModal";
import { useColor } from "../../../styles/useColor";
import { EmptyMessage, type EmptyMessageProps } from "../../EmptyMessage";

export const VerifyMessage = ({ ...props }: Omit<EmptyMessageProps, "title">) => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();
  const handleVerify = useHandleVerify();

  return (
    <Flex alignItems="center" flexDirection="column" margin="auto" data-testid="verify-message">
      <EmptyMessage
        cta="Verify now"
        onClick={handleVerify}
        subtitle="Please verify your account, to unlock all features and keep your account secure."
        title="Verify your account"
        {...props}
      />
      <Link
        marginTop="16px"
        color={color("500")}
        fontSize="12px"
        onClick={() => openWith(<VerificationInfoModal />)}
        textDecor="underline"
      >
        How does verification work?
      </Link>
    </Flex>
  );
};
