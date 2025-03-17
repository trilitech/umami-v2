import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from '@tamagui/core'

export const tamaguiConfig = createTamagui(defaultConfig)

export default tamaguiConfig;

type CustomConfig = typeof tamaguiConfig

// ensure types work
declare module 'tamagui' {
  interface TamaguiCustomConfig extends CustomConfig {}
}