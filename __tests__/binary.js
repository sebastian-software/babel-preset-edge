import buildPreset from "../src"
import { getFixtures, check } from "./core"

describe("Binary", () => {
  const options = buildPreset(null, {
    target: "binary",
    sourceMaps: false,
    env: "production"
  })

  return getFixtures().then((fixtures, titles) => {
    fixtures.forEach((fileName, index) => {
      test(titles[index], () => check(fileName, options))
    })
  })
})
