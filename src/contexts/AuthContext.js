import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebaseApp";
import { doc, setDoc } from "firebase/firestore";
import db from "../config/firestoreService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        await setDoc(
          doc(db, "users", firebaseUser.uid),
          {
            email: firebaseUser.email,
            lastLogin: new Date(),
          },
          { merge: true }
        );
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
  <AuthContext.Provider value={{ user, loading }}>
    {loading ? (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          fontFamily: "Arial",
        }}
      >
        Loading authentication...
      </div>
    ) : (
      children
    )}
  </AuthContext.Provider>
);

}

export function useAuth() {
  return useContext(AuthContext);
}
