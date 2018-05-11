import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Transpile: NodeJS v8", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    target: "node",
    transpile: { node: 8 }
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
