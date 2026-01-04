import { getFirestore } from "firebase/firestore";
import app from "./firebaseApp";

const db = getFirestore(app);

export default db;
