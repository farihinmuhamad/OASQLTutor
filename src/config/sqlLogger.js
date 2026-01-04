import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import db from "./firestoreService";

export async function logSQLActivity({
  uid,
  courseId,
  lessonId,
  query,
  correct,
  feedback
}) {
  if (!uid) return;

  return addDoc(collection(db, "activity_logs"), {
    uid,
    courseId,
    lessonId,
    query,
    correct,
    feedback,
    timestamp: serverTimestamp()
  });
}
