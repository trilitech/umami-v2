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
import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

export const Passkey = ({ children }: PropsWithChildren) => {
  const color = useColor();
  const { openWith } = useDynamicModalContext();
  const isAccountVerified = useIsAccountVerified();

  const domain = "http://localhost:3000/api";
  const handleRegisterPasskey = async () => {
    const response = await fetch(`${domain}/generate-registration-options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: "test",
      }),
    });
    const { options, userId } = await response.json();
    let registrationResponse;
    try {
      // Pass the options to the authenticator and wait for a response
      registrationResponse = await startRegistration({ optionsJSON: options });
    } catch (error) {
      console.log(error);
      // throw new Error("Registration failed");
    }

    if (registrationResponse) {
      console.log('registrationResponse', registrationResponse);
      const verificationResp = await fetch(`${domain}/verify-registration`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          registrationResponse,
        }),
      });
      console.log('PublicKey', registrationResponse.response.publicKey);
      // Wait for the results of verification
      const verificationJSON = await verificationResp.json();
      if (verificationJSON.verified) {
        console.log("verified");
      } else {
        console.log("not verified");
      }
    }
  };

  const handleLoginPasskey = async () => {
    const resp = await fetch(`${domain}/generate-authentication-options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: "test",
      }),
    });
    const optionsJSON = await resp.json();

    let asseResp;
    try {
      // Pass the options to the authenticator and wait for a response
      asseResp = await startAuthentication({ optionsJSON });
    } catch (error) {
      console.log(error)
      throw error;
    }
console.log('asseResp', asseResp);
    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyAuthenticationResponse()
    const verificationResp = await fetch(`${domain}/verify-authentication`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(asseResp),
    });

    // Wait for the results of verification
    const verificationJSON = await verificationResp.json();

    // Show UI appropriate for the `verified` status
    if (verificationJSON && verificationJSON.verified) {
      console.log('authenticated');
    } else {
      console.log('not authenticated');
    }
  };

  return (
    <Flex alignItems="center" flexDirection="column" width="full" height="full">
      <Center flexDirection="column" gap="36px" width="full" height="full">
        <Flex flexDirection="column" gap="12px" width="full">
          <Button width="full" onClick={handleRegisterPasskey} size="lg" variant="primary">
            Register
          </Button>
          <Button width="full" onClick={handleLoginPasskey} size="lg" variant="secondary">
            Login
          </Button>
        </Flex>

        {children}
      </Center>
    </Flex>
  );
};
