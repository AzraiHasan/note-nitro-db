// Generated by nitro
import type { Serialize, Simplify } from 'nitropack'
declare module 'nitropack' {
  type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T
  interface InternalApi {
    '/__nuxt_error': {
      'default': Simplify<Serialize<Awaited<ReturnType<typeof import('../../node_modules/nuxt/dist/core/runtime/nitro/renderer').default>>>>
    }
    '/api/callback': {
      'get': Simplify<Serialize<Awaited<ReturnType<typeof import('../../node_modules/@nuxtjs/kinde/dist/runtime/server/api/callback.get').default>>>>
    }
    '/api/login': {
      'get': Simplify<Serialize<Awaited<ReturnType<typeof import('../../node_modules/@nuxtjs/kinde/dist/runtime/server/api/login.get').default>>>>
    }
    '/api/register': {
      'get': Simplify<Serialize<Awaited<ReturnType<typeof import('../../node_modules/@nuxtjs/kinde/dist/runtime/server/api/register.get').default>>>>
    }
    '/api/health': {
      'get': Simplify<Serialize<Awaited<ReturnType<typeof import('../../node_modules/@nuxtjs/kinde/dist/runtime/server/api/health.get').default>>>>
    }
    '/api/logout': {
      'get': Simplify<Serialize<Awaited<ReturnType<typeof import('../../node_modules/@nuxtjs/kinde/dist/runtime/server/api/logout.get').default>>>>
    }
  }
}
export {}