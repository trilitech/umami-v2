import { SigningType } from "@airgap/beacon-wallet";
import { CODEC, type ProtocolsHash, Uint8ArrayConsumer, getCodec } from "@taquito/local-forging";
import { DefaultProtocol, type MichelsonData, unpackData } from "@taquito/michel-codec";
import { bytesToString, hex2buf } from "@taquito/utils";

import { CustomError } from "../../utils/src/ErrorContext";

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
        if (getSigningTypeFromPayload(payload) !== signingType) {
          throw new CustomError("Invalid prefix for signing type");
        }

        try {
          const consumer = Uint8ArrayConsumer.fromHexString(payload);
          const uint8array = consumer.consume(consumer.length());
          const parsed: MichelsonData = unpackData(uint8array);
          if ("string" in parsed && Object.keys(parsed).length === 1) {
            result = parsed.string;
          } else {
            result = JSON.stringify(parsed);
          }
        } catch {
          // "03" for operation
          // "05" + "01" + 8-padded-length for micheline
          const prefixLen = signingType === SigningType.MICHELINE ? 12 : 2;
          result = bytesToString(payload.slice(prefixLen));
          if (result.length === 0) {
            throw new CustomError("Invalid payload. Failed to decode.");
          }
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
        throw new CustomError(`Unsupported signing type: ${signingType}`);
      }
    }

    if (!isValidASCII(result)) {
      throw new CustomError("Invalid payload. Only ASCII characters are supported.");
    }

    return { result };
  } catch (error) {
    console.error(error);
    return { result: payload, error: "Cannot parse Beacon payload" };
  }
};

const isValidASCII = (str: string) => str.split("").every(char => char.charCodeAt(0) < 128);

const parseOperationMicheline = (payload: string) =>
  getCodec(CODEC.MANAGER, DefaultProtocol as string as ProtocolsHash).decoder(payload);

export const getSigningTypeFromPayload = (payload: string): SigningType =>
  payload.startsWith("05")
    ? SigningType.MICHELINE
    : payload.startsWith("03")
      ? SigningType.OPERATION
      : SigningType.RAW;
