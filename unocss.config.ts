// https://github.com/unocss/unocss
import { defineConfig, Preset, presetAttributify, presetIcons, presetUno, Rule } from 'unocss'

import presetRemToRpx from './preset-rem-to-rpx'

const sizeMapping: Record<string, string> = {
  h: 'height',
  w: 'width',
  m: 'margin',
  p: 'padding',
  mt: 'margin-top',
  mr: 'margin-right',
  mb: 'margin-bottom',
  ml: 'margin-left',
  pt: 'padding-top',
  pr: 'padding-right',
  pb: 'padding-bottom',
  pl: 'padding-left',
  fs: 'font-size',
  br: 'border-radius'
}

function getSizeRules(Mapping: Record<string, string>): Rule<{}>[] {
  return Object.keys(Mapping).map(key => {
    const value = Mapping[key]
    return [new RegExp(`^${key}(\\d+)$`), ([, d]) => ({ [value]: `${d}rpx` })]
  })
}

const customRules: Rule<{}>[] = [['fontColor-red', { color: 'red' }]]
const shortcuts = {
  'custom-shortcut': 'text-lg text-orange hover:text-teal'
}

export const createConfig = () => {
  return defineConfig({
    rules: [...getSizeRules(sizeMapping), ...customRules],
    shortcuts,
    presets: [
      presetUno(),
      presetAttributify(),
      presetIcons({
        prefix: 'icon-',
        extraProperties: {
          display: 'inline-block',
          cursor: 'pointer',
          'font-size': '32rpx'
        },
        collections: {
          ep: () => import('@iconify-json/ep/icons.json').then(i => i.default)
        }
      }),
      presetRemToRpx({
        baseFontSize: 4
      }) as Preset
    ],
    include: [/\.vue$/, /pages.json$/]
  })
}

export default createConfig()
