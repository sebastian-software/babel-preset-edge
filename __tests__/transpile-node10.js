import buildPreset from "../src"
import { check, fixtures, titles } from "./core"

describe("Transpile: NodeJS v8", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    target: "node",
    transpile: { node: 10 }
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
