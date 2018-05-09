import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

describe("Webpack", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    imports: "webpack"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
