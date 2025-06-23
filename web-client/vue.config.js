const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      // Прокси для всех путей, начинающихся с /chat
      '/chat': {
        target: 'http://backend:3000', // Адрес бэкенда на хост-машине
        changeOrigin: true,
      },
      // Прокси для /upload или других путей, если нужно
      '/upload': {
        target: 'http://backend:3000',
        changeOrigin: true,
      },
    }
  }
})