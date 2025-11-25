import admin from "firebase-admin";

// Support both local development (JSON file) and production (environment variables)
let serviceAccount: admin.ServiceAccount;

if (process.env.FIREBASE_PRIVATE_KEY) {
  // Production/Vercel: Use environment variables
  // ServiceAccount interface uses camelCase property names
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || "",
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  };
} else {
  // Local development: Use JSON file
  try {
    const serviceAccountJson = require("../../utils/serviceAccountKey.json");
    // Convert JSON file format (snake_case) to ServiceAccount format (camelCase)
    serviceAccount = {
      projectId: serviceAccountJson.project_id,
      privateKey: serviceAccountJson.private_key,
      clientEmail: serviceAccountJson.client_email,
    };
  } catch (error) {
    console.error("Error loading Firebase service account:", error);
    throw new Error("Firebase service account not found. Please provide serviceAccountKey.json or set environment variables.");
  }
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const firebaseAdmin = admin;
