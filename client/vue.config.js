// module.exports = {
//   devServer: {
//     proxy: {
//       '^/': {
//         target: 'http://localhost:3000/',
//         ws: true,
//         changeOrigin: true
//       },
//     }
//   }
// }

module.exports = {

  pluginOptions: {

    i18n: {

      locale: 'en',

      fallbackLocale: 'en',

      localeDir: 'locales',

      enableInSFC: false

    }

  }

}
