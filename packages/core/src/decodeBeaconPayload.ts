import { SigningType } from "@airgap/beacon-wallet";
import { CODEC, type ProtocolsHash, Uint8ArrayConsumer, getCodec } from "@taquito/local-forging";
import { DefaultProtocol, unpackData } from "@taquito/michel-codec";
import { hex2buf } from "@taquito/utils";

/**
 * Decodes a sign request payload string.
 *
 * @param payload - The payload to decode.
 * @returns The decoded string, or the original payload if decoding fails.
 * @see {@link https://taquito.io/docs/signing/} for more info.
 */
export const decodeBeaconPayload = (
  payload: string,
  signingType: SigningType
): { result: string; error?: string } => {
  try {
    if (!payload.length) {
      return { result: "" };
    }
    let result = payload;

    switch (signingType) {
      case SigningType.MICHELINE:
      case SigningType.OPERATION: {
        const consumer = Uint8ArrayConsumer.fromHexString(payload);
        const uint8array = consumer.consume(consumer.length());
        const parsed = unpackData(uint8array);

        if ("string" in parsed && Object.keys(parsed).length === 1) {
          result = parsed.string;
        } else {
          result = JSON.stringify(parsed);
        }
        break;
      }
      case SigningType.RAW: {
        try {
          result = JSON.stringify(parseOperationMicheline(payload));
        } catch {
          result = new TextDecoder("utf-8", { fatal: true }).decode(hex2buf(payload));
        }
        break;
      }
      default: {
        throw new Error(`Unsupported signing type: ${signingType}`);
      }
    }

    if (!isValidASCII(result)) {
      throw new Error("Invalid payload. Only ASCII characters are supported.");
    }

    return { result };
  } catch {
    return { result: payload, error: "Cannot parse Beacon payload" };
  }
};

const isValidASCII = (str: string) => str.split("").every(char => char.charCodeAt(0) < 128);

const parseOperationMicheline = (payload: string) =>
  getCodec(CODEC.MANAGER, DefaultProtocol as string as ProtocolsHash).decoder(payload);
