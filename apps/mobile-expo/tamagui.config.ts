import { config } from '@tamagui/config/v3'
import { createTamagui } from 'tamagui'

if (typeof document !== 'undefined') {
  console.error('Document is unexpectedly defined!');
}

export const tamaguiConfig = {...createTamagui(config), target: 'native'}

export default tamaguiConfig

export type Conf = typeof tamaguiConfig

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
