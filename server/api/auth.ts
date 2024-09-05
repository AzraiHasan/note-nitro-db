// server/api/auth.ts

import { authService } from '../services/authService'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { action } = body

  if (action === 'register') {
    const { name, email, password } = body
    const user = await authService.registerUser(name, email, password)
    return { success: true, user: { id: user.id, name: user.name, email: user.email } }
  }

  if (action === 'login') {
    const { email, password } = body
    const token = await authService.loginUser(email, password)
    if (token) {
      return { success: true, token }
    } else {
      throw createError({ statusCode: 401, message: 'Invalid email or password' })
    }
  }

  throw createError({ statusCode: 400, message: 'Invalid action' })
})

// GET /api/auth/user
export const getUser = defineEventHandler(async (event) => {
  const token = getHeader(event, 'Authorization')?.split(' ')[1]
  if (!token) {
    throw createError({ statusCode: 401, message: 'No token provided' })
  }

  const payload = await authService.verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, message: 'Invalid token' })
  }

  const user = await authService.getUserById(payload.userId)
  if (!user) {
    throw createError({ statusCode: 404, message: 'User not found' })
  }

  return { id: user.id, name: user.name, email: user.email }
})