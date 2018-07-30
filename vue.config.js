module.exports = {
  pluginOptions: {
    enableInSFC: true,
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  },

  lintOnSave: true,

  pwa: {
    workboxPluginMode: "InjectManifest",
    name: "ZenPress",
    themeColor: "#3498DB",
    msTileColor: "#3498DB"
  }
};
