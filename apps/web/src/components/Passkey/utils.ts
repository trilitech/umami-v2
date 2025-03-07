import { startAuthentication, startRegistration } from "@simplewebauthn/browser";

const domain = "http://localhost:3000/api";

 export const registerPasskey = async (userName: string) => {
    const response = await fetch(`${domain}/generate-registration-options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName
      }),
    });
    const { options, userId } = await response.json();
    let registrationResponse;
    try {
      // Pass the options to the authenticator and wait for a response
      registrationResponse = await startRegistration({ optionsJSON: options });
    } catch (error) {
      console.log(error);
      throw error
    }

    let verified = false;
    if (registrationResponse) {
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
      // Wait for the results of verification
      const verificationJSON = await verificationResp.json();
      if (verificationJSON.verified) {
        verified = true;
        console.log("verified");
      } else {
        console.log("not verified");
      }
    }
    return {
        publicKey: registrationResponse.response.publicKey,
        verified
    }
  };

  export const authenticatePasskey = async (userName: string) => {
    const resp = await fetch(`${domain}/generate-authentication-options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName
      }),
    }); 
    const optionsJSON = await resp.json();
    optionsJSON.challenge = optionsJSON.challenge
    let asseResp;
    try {
      // Pass the options to the authenticator and wait for a response
      asseResp = await startAuthentication({ optionsJSON });
    } catch (error) {
      console.log(error)
      throw error;
    }

    // POST the response to the endpoint that calls
    // @simplewebauthn/server -> verifyAuthenticationResponse()
    const verificationResp = await fetch(`${domain}/verify-authentication`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(asseResp),
    });

    // Wait for the results of verification
    const verificationJSON = await verificationResp.json();

    // Show UI appropriate for the `verified` status
    if (verificationJSON && verificationJSON.verified) {
      console.log("authenticated");
    } else {
      console.log("not authenticated");
    }
    return verificationJSON
  };