import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { registerServiceWorker, initializePWAInstall } from './utils/pwa.js'

// Vue アプリ作成
const app = createApp(App)

// Vue Router
app.use(router)

// PWA 初期化
if (location.protocol === 'https:' || location.hostname === 'localhost') {
  registerServiceWorker()
    .then((success) => {
      if (success) {
        console.log('✅ PWA機能が有効化されました')
      }
    })
    .catch((error) => {
      console.error('❌ PWA初期化に失敗しました:', error)
    })
}

// PWA インストールプロンプト初期化
initializePWAInstall()

// アプリをマウント
app.mount('#app')
