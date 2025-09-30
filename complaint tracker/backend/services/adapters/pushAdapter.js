// pushAdapter.js
import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();

if (!admin.apps.length) {
  const svcPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (!svcPath) {
    console.warn("FIREBASE_SERVICE_ACCOUNT_PATH not set - push notifications disabled");
  } else {
    const serviceAccount = await import(svcPath); // dynamic import path
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount.default || serviceAccount)
    });
  }
}

export async function sendPush(deviceToken, title, body) {
  if (!admin.apps.length) throw new Error("Firebase admin not initialized");
  const message = {
    token: deviceToken,
    notification: { title, body }
  };
  return admin.messaging().send(message);
}
