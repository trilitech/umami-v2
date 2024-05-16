import { SignPayloadRequestOutput } from "@airgap/beacon-wallet";
import { hex2buf } from "@taquito/utils";

// Padding for a sign request payload in Micheline expression.
const PAYLOAD_PADDING = "0501";

const getPayloadHexBytes = (payload: SignPayloadRequestOutput["payload"]) => {
  let index = 0;

  if (payload.startsWith(PAYLOAD_PADDING)) {
    index = 4;

    while (index < payload.length && payload[index] === "0") {
      index += 1;
    }

    let payloadByteLengthRaw = "";
    let payloadByteLength = 0;
    const paddingLength = index;

    while (index < payload.length && payload[index] !== "0") {
      payloadByteLengthRaw += payload[index];
      payloadByteLength = parseInt(payloadByteLengthRaw, 16);

      const remainingPayloadLength = payload.length - payloadByteLengthRaw.length - paddingLength;

      if (payloadByteLength * 2 === remainingPayloadLength) {
        index += 1;
        break;
      }

      if (payloadByteLength * 2 > remainingPayloadLength) {
        throw new Error("Invalid payload length");
      }

      index += 1;
    }
  }

  return payload.slice(index);
};

/**
 * Decodes a sign request payload string.
 *
 * @param payload - The payload to decode.
 * @returns The decoded string, or the original payload if decoding fails.
 * @see {@link https://taquito.io/docs/signing/} for more info.
 */
export const decodePayload = (payload: SignPayloadRequestOutput["payload"]): string => {
  try {
    const string = new TextDecoder("utf-8").decode(hex2buf(getPayloadHexBytes(payload)));

    return string || payload;
  } catch (e) {
    return payload;
  }
};
