import * as dotenv from 'dotenv'
import admin from 'firebase-admin'

dotenv.config({
  path: {
    development: './.env.development',
    production: './.env.production',
  }[process.env.NODE_ENV!],
})

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    projectId: process.env.PROJECT_ID,
  }),
})
