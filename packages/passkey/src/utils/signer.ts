import { type Signer } from "@taquito/taquito";
import { b58cencode, buf2hex, prefix } from "@taquito/utils";
import * as asn1js from "asn1js";

export class PasskeySigner implements Signer {
  constructor(private credentialId: Uint8Array, private publicKeyBuffer: string, private tezosAddress: string) {
    // Validate public key type
    if (!this.publicKeyBuffer.startsWith("p2pk") && !this.publicKeyBuffer.startsWith('sppk')) {
      throw new Error("Unsupported public key type");
    }
  }

  // Return the public key in a Tezos-compatible format
  async publicKey(): Promise<string> {
    return Promise.resolve(this.publicKeyBuffer);
  }

  // Return the Tezos address (public key hash)
  async publicKeyHash(): Promise<string> {
    return Promise.resolve(this.tezosAddress);
  }

  // Not applicable for passkeys as the secret key is non-exportable
  async secretKey(): Promise<string> {
    throw new Error("Secret key retrieval is not supported with passkeys.");
  }

  // Sign the given bytes using the WebAuthn API
  async sign(bytes: string, magicBytes?: Uint8Array): Promise<{ bytes: string; sig: string; prefixSig: string; sbytes: string }> {
    try {
      // Convert the hex string into an ArrayBuffer (challenge)
      const challengeBuffer = this.hexToArrayBuffer(bytes);

      // Prepare the WebAuthn request
      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: challengeBuffer,
        allowCredentials: [{
          id: this.credentialId,
          type: "public-key"
        }],
        timeout: 60000,
        userVerification: "preferred"
      };

      // Get the assertion from WebAuthn
      const assertion = await navigator.credentials.get({ publicKey });
      
      if (!assertion) {
        throw new Error("Authentication failed: No credential returned.");
      }

      // Extract the signature from the assertion
      const authResponse = (assertion as PublicKeyCredential).response as AuthenticatorAssertionResponse;
      
      // Parse the DER signature
      const derSignature = new Uint8Array(authResponse.signature);
      
      // Use asn1js to parse the DER-encoded signature
      // Note: DER is a subset of BER, and fromBER() can parse both formats
      const asn1 = asn1js.fromBER(derSignature.buffer);
      
      if (asn1.offset === -1) {
        throw new Error("Invalid DER signature encoding");
      }

      // The signature is a SEQUENCE of two INTEGERs (r and s)
      const signatureSequence = asn1.result as asn1js.Sequence;
      
      if (signatureSequence.valueBlock.value.length !== 2) {
        throw new Error("Invalid DER signature structure");
      }

      // Extract r and s values
      const rValue = signatureSequence.valueBlock.value[0] as asn1js.Integer;
      const sValue = signatureSequence.valueBlock.value[1] as asn1js.Integer;
      
      // Convert to Buffer and handle padding
      let rBuffer = Buffer.from(rValue.valueBlock.valueHexView);
      let sBuffer = Buffer.from(sValue.valueBlock.valueHexView);
      
      // Remove leading zeros if present (ASN.1 encoding may include them)
      if (rBuffer.length > 32 && rBuffer[0] === 0) {
        rBuffer = rBuffer.subarray(1);
      }
      
      if (sBuffer.length > 32 && sBuffer[0] === 0) {
        sBuffer = sBuffer.subarray(1);
      }
      
      // Pad to 32 bytes if needed
      const paddedR = this.padTo32Bytes(rBuffer);
      const paddedS = this.padTo32Bytes(sBuffer);
      
      // Concatenate r and s to create the signature
      const signature = Buffer.concat([paddedR, paddedS]);
      
      // Convert to hex string
      const signatureHex = buf2hex(signature);
      
      // Create the prefixed signature based on key type
      let prefixSig: string;
      if (this.publicKeyBuffer.startsWith('p2pk')) {
        prefixSig = b58cencode(signature, prefix.p2sig);
      } else {
        prefixSig = b58cencode(signature, prefix.spsig);
      }
      
      // Create sbytes (signed bytes)
      const sbytes = bytes + signatureHex;
      
      return {
        bytes,
        sig: signatureHex,
        prefixSig,
        sbytes
      };
    } catch (error) {
      console.error("Signing error:", error);
      throw error;
    }
  }
  
  // Pad a byte array to 32 bytes
  private padTo32Bytes(input: Uint8Array): Buffer {
    if (input.length === 32) {
      return Buffer.from(input);
    }
    
    const result = Buffer.alloc(32, 0);
    
    if (input.length > 32) {
      // If longer than 32 bytes, take the last 32 bytes
      Buffer.from(input.subarray(input.length - 32)).copy(result);
    } else {
      // If shorter than 32 bytes, pad with leading zeros
      Buffer.from(input).copy(result, 32 - input.length);
    }
    
    return result;
  }

  // Convert hex string to ArrayBuffer
  private hexToArrayBuffer(hexString: string): ArrayBuffer {
    const cleanHex = hexString.startsWith("0x") ? hexString.slice(2) : hexString;
    const pairs = [];
    for (let i = 0; i < cleanHex.length; i += 2) {
      pairs.push(cleanHex.substring(i, i + 2));
    }
    const bytes = new Uint8Array(pairs.map(hex => parseInt(hex, 16)));
    return bytes.buffer;
  }
}
