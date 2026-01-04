import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getSkillProgress, getLessonProgress } from "../../util/getProgress";
import { useContext } from "react";
import { ThemeContext } from "../../config/config";

function Card({ title, children }) {
  return (
    <div
      style={{
        marginBottom: 24,
        padding: 16,
        borderRadius: 12,
        background: "#ffffff",
        boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>{title}</h2>
      {children}
    </div>
  );
}

export default function ProgressPage() {
  const { firebase } = useContext(ThemeContext);

  const [skills, setSkills] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user?.uid;

  useEffect(() => {
    if (!uid || !firebase?.db) return;

    Promise.all([
      getSkillProgress(firebase.db, uid),
      getLessonProgress(firebase.db, uid),
    ]).then(([skillData, lessonData]) => {
      setSkills(skillData);
      setLessons(lessonData);
      setLoading(false);
    });
  }, [uid, firebase]);

  if (loading) {
    return <div style={{ padding: 24 }}>Loading progress...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <h1>Learning Progress Report</h1>
      <div
        style={{
            marginBottom: 24,
            padding: 12,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#f9f9f9",
        }}
        >
        <strong>User Information</strong>
        <div>Email: {user?.email || "Unknown"}</div>
        <div>
            UID: <code>{user?.uid}</code>
        </div>
      </div>

      <hr />

      <Card title="📘 Lesson Progress">
        {lessons.length === 0 && <p>No lesson progress yet.</p>}

        {/* HEADER */}
        <div
            style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr",
            fontWeight: "bold",
            paddingBottom: 8,
            borderBottom: "2px solid #ccc",
            marginBottom: 8,
            }}
        >
            <span>Lesson</span>
            <span>Accuracy</span>
            <span>Status</span>
        </div>

        {/* ROWS */}
        {lessons.map((l) => (
            <div
            key={l.lessonId}
            style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                padding: "6px 0",
                borderBottom: "1px solid #eee",
            }}
            >
            <strong>{l.lessonId}</strong>
            <span>{Math.round(l.accuracy * 100)}%</span>
            <em>{l.status}</em>
            </div>
        ))}
        </Card>

      <hr />

      <Card title="🧠 Skill Progress">
        {skills.length === 0 && <p>No skill progress yet.</p>}

        {/* HEADER */}
        <div
            style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            fontWeight: "bold",
            paddingBottom: 8,
            borderBottom: "2px solid #ccc",
            marginBottom: 8,
            }}
        >
            <span>Skill</span>
            <span>Accuracy</span>
            <span>Correct / Attempts</span>
            <span>Status</span>
        </div>

        {/* ROWS */}
        {skills.map((s) => (
            <div
            key={s.skillId}
            style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr",
                padding: "6px 0",
                borderBottom: "1px solid #eee",
            }}
            >
            <strong>{s.skillId}</strong>
            <span>{Math.round(s.accuracy * 100)}%</span>
            <span>
                {s.correct}/{s.attempts}
            </span>
            <em>{s.status}</em>
            </div>
        ))}
        </Card>

        <hr />

        <Card title="ℹ️ Status Information">
        <ul>
            <li><strong>Not Started</strong>: Belum ada jawaban</li>
            <li><strong>Developing</strong>: Sedang dipelajari, belum stabil</li>
            <li><strong>Mastered</strong>: Akurasi tinggi dan konsisten</li>
        </ul>
        </Card>

    </div>
  );
}
