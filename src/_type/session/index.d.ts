import 'express-session'

declare module 'express-session' {
  interface SessionData {
    uid?: string // uid 속성 추가
  }
}
