// Firebase Web App 設定範本。
// 請從 Firebase Console > 專案設定 > 你的應用程式 > SDK 設定與設定
// 複製 config 貼到這裡。這些值不是伺服器密鑰，但 Firestore 規則仍會保護資料。
export const firebaseConfig = {
  apiKey: 'AIzaSyBIdCP0GeuNHg4WL6RqRs8K2jZNw9ttKAU',
  authDomain: 'textbook-review.firebaseapp.com',
  projectId: 'textbook-review',
  storageBucket: 'textbook-review.firebasestorage.app',
  messagingSenderId: '447673483012',
  appId: '1:447673483012:web:7488ff3c259016a57e9a51',
  measurementId: 'G-CB8ZSBMMGX'
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.messagingSenderId && firebaseConfig.appId
);
