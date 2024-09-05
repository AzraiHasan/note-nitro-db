// server/middleware/auth.ts
import { jwtVerify } from 'jose'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const token = getHeader(event, 'Authorization')?.split(' ')[1]

  if (!token) {
    return
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(config.jwtSecret))
    event.context.auth = { userId: payload.userId as string }
  } catch (error) {
    console.error('Error verifying token:', error)
  }
})