import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";


export async function updateSkillProgress(
  db,
  uid,
  skillId,
  lessonId,
  isCorrect
) {
  const ref = doc(db, "users", uid, "skillProgress", skillId);
  const snap = await getDoc(ref);

  let attempts = 0;
  let correct = 0;

  if (snap.exists()) {
    attempts = snap.data().attempts || 0;
    correct = snap.data().correct || 0;
  }

  attempts += 1;
  if (isCorrect) correct += 1;

  const accuracy = correct / attempts;

  let status = "Not Started";
  if (accuracy >= 0.8 && attempts >= 5) status = "Mastered";
  else if (attempts > 0) status = "Developing";

  await setDoc(
    ref,
    {
      skillId,
      lessonId,
      attempts,
      correct,
      accuracy,
      status,
      lastUpdated: serverTimestamp(),
    },
    { merge: true }
  );

  return { skillId, lessonId, status };
}

export async function updateLessonProgress(db, uid, lessonId) {
  const skillsRef = collection(db, "users", uid, "skillProgress");
  const snapshot = await getDocs(skillsRef);

  let totalSkills = 0;
  let masteredSkills = 0;
  let attempts = 0;
  let correct = 0;

  snapshot.forEach((doc) => {
    const d = doc.data();
    if (d.lessonId !== lessonId) return;

    totalSkills += 1;
    attempts += d.attempts || 0;
    correct += d.correct || 0;

    if (d.status === "Mastered") {
      masteredSkills += 1;
    }
  });

  if (totalSkills === 0) return;

  const accuracy = correct / attempts;

  let status = "Not Started";
  if (masteredSkills === totalSkills) status = "Mastered";
  else if (attempts > 0) status = "Developing";

  await setDoc(
    doc(db, "users", uid, "lessonProgress", lessonId),
    {
      lessonId,
      totalSkills,
      masteredSkills,
      accuracy,
      status,
      lastUpdated: serverTimestamp(),
    },
    { merge: true }
  );
}
