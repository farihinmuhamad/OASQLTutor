// src/util/aggregateProgress.js
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  getDocs,
} from "firebase/firestore";


/**
 * Aggregate skill progress from skillProgressLogs
 */
export async function aggregateSkillProgress(db, firebaseUID, collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));

  const skillMap = {}; // skillId -> stats

  snapshot.forEach((docSnap) => {
    const d = docSnap.data();
    if (d.firebase_uid !== firebaseUID) return;

    const skill = d.skill;
    if (!skill) return;

    if (!skillMap[skill]) {
      skillMap[skill] = {
        skillId: skill,
        lessonId: d.lesson,
        attempts: 0,
        correct: 0,
      };
    }

    skillMap[skill].attempts += 1;
    if (d.isCorrect) skillMap[skill].correct += 1;
  });

  // write aggregated skill progress
  for (const skillId in skillMap) {
    const s = skillMap[skillId];
    const accuracy = s.correct / s.attempts;

    let status = "Not Started";
    if (accuracy >= 0.8 && s.attempts >= 5) status = "Mastered";
    else if (s.attempts > 0) status = "Developing";

    await setDoc(
      doc(db, "users", firebaseUID, "skillProgress", skillId),
      {
        ...s,
        accuracy,
        status,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  }

  return skillMap;
}

export async function aggregateLessonProgress(db, firebaseUID, skillMap) {
  const lessonMap = {};

  Object.values(skillMap).forEach((s) => {
    if (!lessonMap[s.lessonId]) {
      lessonMap[s.lessonId] = {
        lessonId: s.lessonId,
        totalSkills: 0,
        masteredSkills: 0,
        attempts: 0,
        correct: 0,
      };
    }

    lessonMap[s.lessonId].totalSkills += 1;
    lessonMap[s.lessonId].attempts += s.attempts;
    lessonMap[s.lessonId].correct += s.correct;

    if (s.attempts > 0 && s.correct / s.attempts >= 0.8) {
      lessonMap[s.lessonId].masteredSkills += 1;
    }
  });

  for (const lessonId in lessonMap) {
    const l = lessonMap[lessonId];
    const accuracy = l.correct / l.attempts;

    let status = "Not Started";
    if (l.masteredSkills === l.totalSkills) status = "Mastered";
    else if (l.attempts > 0) status = "Developing";

    await setDoc(
      doc(db, "users", firebaseUID, "lessonProgress", lessonId),
      {
        ...l,
        accuracy,
        status,
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
  }
}
