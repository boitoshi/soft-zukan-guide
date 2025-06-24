import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'
import { registerServiceWorker, initializePWAInstall } from './utils/pwa.js'

// TailwindCSSはCDNから読み込まれるので、ここでは不要

// Vue アプリ作成
const app = createApp(App)

// PWA 初期化
if (location.protocol === 'https:' || location.hostname === 'localhost') {
  // HTTPSまたはローカル環境でのみService Worker登録
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
