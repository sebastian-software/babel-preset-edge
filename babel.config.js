/* eslint-disable import/no-commonjs */
module.exports = (api) => {
  const env = api.env()

  return {
    "presets": [
      [
        "@babel/preset-env",
        {
          "modules": env === "test" ? "commonjs" : false,
          "corejs": 3,
          "useBuiltIns": "usage",
          "targets": {
            "node": "6.10"
          }
        }
      ]
    ],
    "plugins": [
      [
        "@babel/plugin-transform-runtime",
        {
          "helpers": true,
          "regenerator": false,
          "useESModules": false
        }
      ],
      "@babel/plugin-proposal-object-rest-spread"
    ]
  }
}
