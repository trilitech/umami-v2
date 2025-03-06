import { Button, Center, Divider, Flex, Heading, Text } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import hj from "@hotjar/browser";
import { useDynamicModalContext } from "@umami/components";
import { size } from "lodash";
import { title } from "process";
import { type PropsWithChildren } from "react";
import { useColor } from "../../styles/useColor";
import { trackAccountEvent, trackOnboardingEvent } from "../../utils/analytics";
import { AccountTileWrapper } from "../AccountTile";
import { useIsAccountVerified } from "../Onboarding/VerificationFlow";
import { clearConfigCache } from "prettier";
import { startRegistration } from '@simplewebauthn/browser';




export const Passkey = ({ children }: PropsWithChildren) => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();
  const isAccountVerified = useIsAccountVerified();

  // hj.stateChange("onboardOptions");

const handleRegisterPasskey = async () => {
  const domain = "http://localhost:3000/api"
  const response = await fetch(`${domain}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: "test",
    })});
    const {options, userId} = await response.json();
    // const optionsJSON = await response.json();
    let registrationResponse;
    try {
      // Pass the options to the authenticator and wait for a response
      registrationResponse = await startRegistration({ optionsJSON: options });
    } catch (error) {
      console.log(error);
      // throw error;
    }

    if (registrationResponse) {
      const verificationResp =await fetch(`${domain}/verify-registration`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          registrationResponse
        }),
      });
  
      // Wait for the results of verification
      const verificationJSON = await verificationResp.json();
      if(verificationJSON.verified) {
        console.log("verified");
      } else {
        console.log("not verified");
    }
  }
}
//   const handleCreateNewWallet = () => {
//     if (isAccountVerified) {
//       const handleNameAccount = () => {
//         trackAccountEvent("set_account_name");

//         return openWith(<SetupPassword mode="add_account" />);
//       };

//       return openWith(
//         <NameAccountModal
//           buttonLabel="Continue"
//           onSubmit={handleNameAccount}
//           subtitle={"Name your account or edit your\n account name later."}
//           title="Create Account"
//           withAdvancedSettings
//         />
//       );
//     } else {
//       return openWith(<SetupPassword mode="new_mnemonic" />);
//     }
//   };

  return (
    <Flex alignItems="center" flexDirection="column" width="full" height="full">

      <Center flexDirection="column" gap="36px" width="full" height="full">

        <Flex flexDirection="column" gap="12px" width="full">
          <Button
            width="full"
            onClick={handleRegisterPasskey}
            size="lg"
            variant="primary"
          >
            Register
          </Button>
          <Button
            width="full"
            // onClick={() => {
            //   trackOnboardingEvent("use_existing_wallet");
            //   return openWith(<ImportWallet />, {
            //     size: "xl",
            //   });
            // }}
            size="lg"
            variant="secondary"
          >
            Login
          </Button>
        </Flex>

        {children}
      </Center>
    </Flex>
  );
};
