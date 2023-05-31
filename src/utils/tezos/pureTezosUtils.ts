// This module should not be mmocked
import { validateAddress, ValidationResult } from "@taquito/utils";

export const addressIsValid = (pkh: string) =>
  validateAddress(pkh) === ValidationResult.VALID;
