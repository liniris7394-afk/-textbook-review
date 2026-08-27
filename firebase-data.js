import { firebaseConfig, isFirebaseConfigured } from './firebase-config.js';

let db = null;
let firestore = null;
let auth = null;

async function getFirestoreDb() {
  if (!isFirebaseConfigured) return null;
  if (db) return db;
  const [{ initializeApp }, firestoreModule, authModule] = await Promise.all([
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js'),
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js'),
    import('https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js')
  ]);
  const app = initializeApp(firebaseConfig);
  firestore = firestoreModule;
  auth = authModule.getAuth(app);
  if (!auth.currentUser) await authModule.signInAnonymously(auth);
  db = firestore.getFirestore(app);
  return db;
}

export async function loadCases() {
  const database = await getFirestoreDb();
  if (!database) return null;
  const snapshot = await firestore.getDocs(
    firestore.query(firestore.collection(database, 'cases'), firestore.orderBy('createdAt', 'desc'))
  );
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

export async function createCase(caseData) {
  const database = await getFirestoreDb();
  if (!database) return null;
  const ref = await firestore.addDoc(firestore.collection(database, 'cases'), {
    ...caseData,
    createdAt: firestore.serverTimestamp(),
    updatedAt: firestore.serverTimestamp()
  });
  return { id: ref.id, ...caseData };
}

export async function updateCase(caseId, caseData) {
  const database = await getFirestoreDb();
  if (!database) return null;
  await firestore.updateDoc(firestore.doc(database, 'cases', caseId), { ...caseData, updatedAt: firestore.serverTimestamp() });
  return { id: caseId, ...caseData };
}

export async function deleteCase(caseId) {
  const database = await getFirestoreDb();
  if (!database) return false;
  await firestore.deleteDoc(firestore.doc(database, 'cases', caseId));
  return true;
}

export async function loadDocuments(collectionName) {
  const database = await getFirestoreDb();
  if (!database) return null;
  const snapshot = await firestore.getDocs(firestore.collection(database, collectionName));
  return snapshot.docs.map(item => ({ id: item.id, ...item.data() }));
}

export { isFirebaseConfigured };
