import dotenv from 'dotenv'
import admin from 'firebase-admin'

switch (process.env.NODE_ENV) {
  case 'development':
    dotenv.config({ path: '.env.development' })

    break

  case 'production':
    dotenv.config({ path: '.env.production' })
    break
}

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: process.env.CLIENT_EMAIL,
    privateKey: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    projectId: process.env.PROJECT_ID,
  }),
})
