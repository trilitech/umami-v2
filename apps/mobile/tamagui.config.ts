import { config } from "@tamagui/config/v3";
import { createTamagui } from "tamagui";

export const tamaguiConfig = createTamagui(config);

export default tamaguiConfig;

export type Conf = typeof tamaguiConfig;

declare module "tamagui" {
  // eslint-disable-next-line
  interface TamaguiCustomConfig extends Conf {}
}
