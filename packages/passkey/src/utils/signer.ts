import { hash } from "@stablelib/blake2b";
import { type Signer } from "@taquito/taquito";
import { b58cencode, buf2hex, hex2buf, mergebuf, prefix, verifySignature } from "@taquito/utils";
import * as asn1js from "asn1js";

export class PasskeySigner implements Signer {
  constructor(private credentialId: Uint8Array, private publicKeyBuffer: string, private tezosAddress: string) {
    // Validate public key type
    if (!this.publicKeyBuffer.startsWith("p2pk") && !this.publicKeyBuffer.startsWith("sppk")) {
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

  /**
   * Sign the given bytes using the WebAuthn API
   * Following Taquito's approach from InMemorySigner and ECKey implementation
   *  
   * @param bytes Bytes to sign (hex string)
   * @param watermark Optional watermark to prepend to the bytes before hashing
   */
  async sign(bytes: string, watermark?: Uint8Array): Promise<{ bytes: string; sig: string; prefixSig: string; sbytes: string }> {
    try {
      // Step 1: Prepare the bytes to sign, including watermark if provided
      let bb = hex2buf(bytes);
      if (typeof watermark !== "undefined") {
        bb = mergebuf(watermark, bb);
      }
      
      // Step 2: Create Blake2b hash of the bytes (following Taquito's approach)
      const bytesHash = hash(bb, 32);
      
      // Step 3: Convert the hash into a challenge for WebAuthn
      const challengeBuffer = bytesHash.buffer;

      // Step 4: Prepare the WebAuthn request
      const publicKey: PublicKeyCredentialRequestOptions = {
        challenge: challengeBuffer,
        allowCredentials: [{
          id: this.credentialId,
          type: "public-key"
        }],
        timeout: 60000,
        userVerification: "preferred"
      };

      // Step 5: Get the assertion from WebAuthn
      const assertion = await navigator.credentials.get({ publicKey });
      
      if (!assertion) {
        throw new Error("Authentication failed: No credential returned.");
      }

      // Step 6: Extract the signature from the assertion
      const authResponse = (assertion as PublicKeyCredential).response as AuthenticatorAssertionResponse;
      
      // Step 7: Parse the DER signature
      const derSignature = new Uint8Array(authResponse.signature);
      
      // Step 8: Use asn1js to parse the DER-encoded signature
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
      
      // Step 9: Concatenate r and s to create the signature (following ECKey approach)
      const signature = Buffer.concat([paddedR, paddedS]);
      
      // Step 10: Convert to hex string for sig value
      const signatureHex = buf2hex(signature);
      
      // Step 11: Create the prefixed signature based on key type (following ECKey approach)
      let prefixSig: string;
      if (this.publicKeyBuffer.startsWith("p2pk")) {
        prefixSig = b58cencode(signature, prefix.p2sig);
      } else {
        prefixSig = b58cencode(signature, prefix.spsig);
      }
      
      // Step 12: Create sbytes (signed bytes) - original bytes + signature hex
      const sbytes = bytes + signatureHex;
      
      // Step 13: Verify the signature before returning
      // For watermarked operations, we need to verify against the original bytes with watermark
      console.log("verifying signature", buf2hex(bb), this.publicKeyBuffer, prefixSig);
      const isValid = verifySignature(buf2hex(bb), this.publicKeyBuffer, prefixSig);
      
      if (!isValid) {
        console.warn("Warning: Generated signature failed verification");
        // You can choose to throw an error here or continue with the potentially invalid signature
        throw new Error("Signature verification failed");
      }
      
      // Step 14: Return the signature data in the format expected by Taquito
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
