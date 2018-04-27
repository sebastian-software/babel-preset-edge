import buildPreset from "../src"
import { getFixtures, check } from "./core"

describe("Compressed", () => {
  const options = buildPreset(null, {
    modules: false,
    sourceMaps: false,
    compression: true
  })

  getFixtures().then((fixtures, titles) => {
    fixtures.forEach((fileName, index) => {
      test(titles[index], () => check(fileName, options))
    })
  })
})
