import buildPreset from "../src"
import { fixtures, titles, check } from "./core"

const options = buildPreset(null, {
  modules: false,
  target: "es2015",
  sourceMaps: false
})

fixtures.forEach((fileName, index) => {
  test(titles[index], () => check(fileName, options))
})
