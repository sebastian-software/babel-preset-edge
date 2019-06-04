import typescriptPreset from "@babel/preset-typescript"

export default function typescript(presets, plugins, options) {
  presets.push([
    typescriptPreset,
    {
      isTSX: true,
      jsxPragma: options.jsxPragma,
      allExtensions: true
    }
  ])
}
