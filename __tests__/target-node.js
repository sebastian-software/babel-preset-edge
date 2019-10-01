import buildPreset from "../src"

import { check, fixtures, titles } from "./core"

describe("Target: NodeJS", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    target: "node"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
