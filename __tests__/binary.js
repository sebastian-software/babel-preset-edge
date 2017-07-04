import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

const options = buildPreset(null, { target: "binary", sourceMaps: false, env: "production" })

fixtures.forEach((fileName, index) => {
  test(titles[index], () => check(fileName, options))
})
