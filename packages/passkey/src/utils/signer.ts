import { Signer } from '@taquito/taquito';

export class PasskeySigner implements Signer {
  // Store credential details from registration
  constructor(private credentialId: Uint8Array<ArrayBuffer>, private publicKeyBuffer: ArrayBuffer, private tezosAddress: string) {}

  // Return the public key in a Tezos-compatible format (you might need to encode this appropriately)
  async publicKey(): Promise<string> {
    // You may need to convert your publicKeyBuffer to a base58 or hex format depending on your Tezos settings.
    return this.bufferToHex(this.publicKeyBuffer);
  }

  // Return the Tezos address (public key hash)
  async publicKeyHash(): Promise<string> {
    return this.tezosAddress;
  }

  // Not applicable for passkeys as the secret key is non-exportable
  async secretKey(): Promise<string> {
    throw new Error('Secret key retrieval is not supported with passkeys.');
  }

  // Sign the given bytes using the WebAuthn API
  async sign(bytes: string, magicBytes?: Uint8Array): Promise<{ bytes: string; sig: string; prefixSig: string; sbytes: string }> {
    // Convert the hex string into an ArrayBuffer (challenge)
    const challengeBuffer = this.hexToArrayBuffer(bytes);

    // Prepare the PublicKeyCredentialRequestOptions object
    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: challengeBuffer,
      // Specify the allowed credential (the one created during registration)
      allowCredentials: [{
        id: this.credentialId,
        type: 'public-key'
      }],
      // Optionally, specify a timeout and any other parameters needed by your use case
      timeout: 60000
    };

    // Call WebAuthn to get an assertion (this will prompt the user to use their passkey)
    const assertion = await navigator.credentials.get({ publicKey });
    console.log('{assertion}', assertion);
    if (!assertion) {
      throw new Error('Authentication failed: No credential returned.');
    }

    // Process the assertion to extract the signature
    // NOTE: The exact method to extract the signature will depend on your authenticator and WebAuthn response format.
    const authResponse = (assertion as PublicKeyCredential).response as AuthenticatorAssertionResponse;
    
    // For example, you might access authResponse.signature which is an ArrayBuffer.
    const signatureBuffer = authResponse.signature;
    const signatureHex = this.bufferToHex(signatureBuffer);

    // In many cases, Tezos requires additional formatting, like prefixing the signature with specific bytes.
    // For now, we return the same signature for both fields.
    return {
      bytes,
      sig: signatureHex,
      prefixSig: signatureHex,
      sbytes: bytes + signatureHex
    };
  }

  // Utility: Convert ArrayBuffer to hex string
  private bufferToHex(buffer: ArrayBuffer): string {
    return Array.prototype.map.call(new Uint8Array(buffer), (x: number) => ('00' + x.toString(16)).slice(-2)).join('');
  }

  // Utility: Convert hex string to ArrayBuffer
  private hexToArrayBuffer(hexString: string): ArrayBuffer {
    const bytes = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    return bytes.buffer;
  }
}