import { useState } from "react";
import AppTP1 from "./AppTP1";   // renommer l'ancien App.jsx en AppTP1.jsx
import AppTP2 from "./QCM_TP2";

export default function App() {
  const [tp, setTp] = useState(null);

  if (tp === "tp1") return <AppTP1 onBack={() => setTp(null)} />;
  if (tp === "tp2") return <AppTP2 onBack={() => setTp(null)} />;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg,#0D1F2D,#1A4A7A)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Trebuchet MS', sans-serif", padding: 20
    }}>
      <div style={{ textAlign: "center", maxWidth: 500, width: "100%" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🐍</div>
        <h1 style={{ color: "#E67E22", fontSize: 32, marginBottom: 6 }}>PCEP — QCM</h1>
        <p style={{ color: "#5B7A9A", marginBottom: 36 }}>Python Essentials 1 · ISET Béja</p>

        {[
          { tp: "tp1", title: "TP1 — Premiers pas", subtitle: "print() · Littéraux · Bases numériques · Erreurs", color: "#1A5276" },
          { tp: "tp2", title: "TP2 — Variables & Opérateurs", subtitle: "input() · Types · // % ** · Opérateurs augmentés", color: "#E67E22" },
        ].map((item) => (
          <button key={item.tp} onClick={() => setTp(item.tp)}
            style={{
              width: "100%", background: item.color, color: "#fff",
              border: "none", borderRadius: 12, padding: "18px 24px",
              marginBottom: 14, cursor: "pointer", textAlign: "left",
            }}>
            <div style={{ fontSize: 18, fontWeight: 800 }}>{item.title}</div>
            <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{item.subtitle}</div>
          </button>
        ))}

        <p style={{ color: "#ffffff", fontSize: 11, marginTop: 20 }}>
          Mme. Haifa CHORFI · 2025-2026
        </p>
      </div>
    </div>
  );
}