import { useState } from "react";
import AppTP1 from "./AppTP1";   
import AppTP2 from "./QCM_TP2";
import AppTP3 from "./AppTP3";
import AppTP4 from "./AppTP4";
import AppTP5 from "./AppTP5";

export default function App() {
  const [tp, setTp] = useState(null);

  if (tp === "tp1") return <AppTP1 onBack={() => setTp(null)} />;
  if (tp === "tp2") return <AppTP2 onBack={() => setTp(null)} />;
  if (tp === "tp3") return <AppTP3 onBack={() => setTp(null)}/>;
  if (tp === "tp4") return <AppTP4 onBack={() => setTp(null)}/>;
  if (tp === "tp5") return <AppTP5 onBack={() => setTp(null)}/>;

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
          {
      tp: "tp3",
      title: "TP3 — Structures Conditionnelles",
      subtitle: "if · elif · else · and · or · not · Conditions imbriquées",
      tags: ["10 questions", "Module 3"],
      color: "#1E8449",
      border: "#27AE60",
    },{ tp: "tp4", title: "TP4 — Itérations & Listes", subtitle: "for · while · range · break. continue", color: "#c9e622" },
    { tp: "tp5", title: "TP5 — Fonctions, Tuples, Dictionnaires & Exceptions", subtitle: "def / return  · global · tuple = () immuable · dict = {} mutable· try/except/finally ", color: "#f5f5b0" },
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