import { collection, getDocs } from "firebase/firestore";

/**
 * Ambil progress skill user
 */
export async function getSkillProgress(db, uid) {
  const snap = await getDocs(
    collection(db, "users", uid, "skillProgress")
  );

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}

/**
 * Ambil progress lesson user
 */
export async function getLessonProgress(db, uid) {
  const snap = await getDocs(
    collection(db, "users", uid, "lessonProgress")
  );

  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));
}
