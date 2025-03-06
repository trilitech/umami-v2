import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

const domain = "http://localhost:3000/api";

 export const registerPasskey = async () => {
    const response = await fetch(`${domain}/generate-registration-options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: "test-trili",
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
        publicKey: registrationResponse?.response.publicKey,
        verified
    }
  };

  export const authenticatePasskey = async () => {
    const resp = await fetch(`${domain}/generate-authentication-options`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: "test-trili",
      }),
    }); 
    const optionsJSON = await resp.json();
console.log('optionsJSON', optionsJSON);
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
    console.log('verificationJSON', verificationJSON);

    // Show UI appropriate for the `verified` status
    if (verificationJSON && verificationJSON.verified) {
      console.log('authenticated');
    } else {
      console.log('not authenticated');
    }
    return verificationJSON
  };