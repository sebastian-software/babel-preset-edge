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
            "node": "8"
          }
        }
      ]
    ],
    "plugins": [
      [
        "@babel/plugin-transform-runtime",
        {
          "corejs": false,
          "helpers": true,
          "regenerator": false,
          "useESModules": false
        }
      ],
      "@babel/plugin-proposal-object-rest-spread"
    ]
  }
}
