// src/env.d.ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, any>
  export default component
}

import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    choose_game: 1 | 2 | 3 | 4 | 5
  }
}