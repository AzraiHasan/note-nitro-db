// server/services/authService.ts

import { getDatabase } from '../db'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

export interface User {
  id: string
  name: string
  email: string
  password: string
}

export const authService = {
  async registerUser(name: string, email: string, password: string): Promise<User> {
    const db = getDatabase()
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const { lastInsertRowid } = await db.sql`
      INSERT INTO users (name, email, password)
      VALUES (${name}, ${email}, ${hashedPassword})
    `

    return { id: lastInsertRowid.toString(), name, email, password: hashedPassword }
  },

  async loginUser(email: string, password: string): Promise<string | null> {
    const db = getDatabase()
    const { rows } = await db.sql`SELECT * FROM users WHERE email = ${email}`

    if (rows.length === 0) {
      return null
    }

    const user = rows[0]
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return null
    }

    const token = await this.generateToken(user.id)
    return token
  },

  async generateToken(userId: string): Promise<string> {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key')
    const token = await new SignJWT({ userId })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2h')
      .sign(secret)
    return token
  },

  async verifyToken(token: string): Promise<{ userId: string } | null> {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-key')
    try {
      const { payload } = await jwtVerify(token, secret)
      return payload as { userId: string }
    } catch (error) {
      return null
    }
  },

  async getUserById(id: string): Promise<User | null> {
    const db = getDatabase()
    const { rows } = await db.sql`SELECT id, name, email FROM users WHERE id = ${id}`

    if (rows.length === 0) {
      return null
    }

    return rows[0] as User
  }
}