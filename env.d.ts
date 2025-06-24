/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// Additional type declarations for better IDE support
declare module 'vue' {
  export * from '@vue/runtime-dom'
}

// DOM type declarations
declare global {
  interface HTMLSelectElement extends Element {
    value: string
  }
  interface HTMLInputElement extends Element {
    value: string
  }
}
