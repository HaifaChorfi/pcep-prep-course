// ─────────────────────────────────────────────────────────────────────────────
//  QCM TP2 — Variables, Types & Opérateurs  |  PCEP Module 2  |  ISET Béja
//  Firebase Realtime Database  ·  GitHub Pages
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import { ref, set, remove, onValue } from "firebase/database";

// ═══════════════════════════════════════════════════════════════════════════
// QUESTIONS — 15 questions PCEP Module 2
// ═══════════════════════════════════════════════════════════════════════════
const QUESTIONS = [
  // ── Niveau 1 : Variables & input() ──────────────────────────────────────
  {
    id: 1, niveau: 1,
    theme: "input() — type retourné",
    code: `age = input("Entrez votre âge : ")
print(type(age))`,
    question: "L'utilisateur tape 20. Quelle est la sortie ?",
    options: [
      "<class 'int'>",
      "<class 'float'>",
      "<class 'str'>",
      "<class 'bool'>",
    ],
    correct: 2,
    explication: [
      "input() retourne TOUJOURS un str, peu importe ce que l'utilisateur tape.",
      "Même si l'utilisateur tape 20, age vaut \"20\" (str).",
      "→ Correction : age = int(input(\"Entrez votre âge : \"))",
    ],
  },
  {
    id: 2, niveau: 1,
    theme: "Nommage de variables",
    code: `# Lequel de ces noms est VALIDE ?`,
    question: "Quel nom de variable est valide en Python ?",
    options: [
      "2eme_place",
      "mon-score",
      "_resultat",
      "for",
    ],
    correct: 2,
    explication: [
      "2eme_place → commence par un chiffre : interdit.",
      "mon-score  → le tiret - est interdit dans les noms.",
      "_resultat  → valide ✅ : commence par _ , suit les règles.",
      "for        → mot-clé réservé Python : interdit.",
    ],
  },
  {
    id: 3, niveau: 1,
    theme: "Conversion int()",
    code: `a = int(input("a : "))   # saisie : "7"
b = int(input("b : "))   # saisie : "3"
print(a + b)`,
    question: "Quelle est la sortie ?",
    options: ["73", "10", "TypeError", "\"73\""],
    correct: 1,
    explication: [
      "int() convertit le str \"7\" en entier 7, et \"3\" en 3.",
      "a + b = 7 + 3 = 10  (addition d'entiers).",
      "Sans int(), \"7\" + \"3\" = \"73\"  (concaténation str).",
    ],
  },

  // ── Niveau 1 : Opérateurs de base ───────────────────────────────────────
  {
    id: 4, niveau: 1,
    theme: "Division réelle /",
    code: `print(6 / 2)`,
    question: "Quelle est la sortie exacte ?",
    options: ["3", "3.0", "3.5", "TypeError"],
    correct: 1,
    explication: [
      "/ donne TOUJOURS un float en Python 3.",
      "6 / 2 = 3.0  (float), même si le résultat est entier.",
      "Pour obtenir un int : utiliser //  →  6 // 2 = 3",
    ],
  },
  {
    id: 5, niveau: 1,
    theme: "Division entière //",
    code: `print(17 // 5)
print(17 % 5)`,
    question: "Quelles sont les deux sorties (dans l'ordre) ?",
    options: ["3 et 2", "3.4 et 2", "3 et 1.4", "4 et 2"],
    correct: 0,
    explication: [
      "17 // 5 = 3  (quotient entier : 5 entre 3 fois dans 17)",
      "17 %  5 = 2  (reste : 17 = 3×5 + 2)",
      "Vérification : 3×5 + 2 = 17 ✓",
    ],
  },

  // ── Niveau 2 : Priorité et associativité ────────────────────────────────
  {
    id: 6, niveau: 2,
    theme: "Puissance ** — associativité",
    code: `print(2 ** 3 ** 2)`,
    question: "Quelle est la sortie ?",
    options: ["64", "512", "72", "SyntaxError"],
    correct: 1,
    explication: [
      "** s'évalue de DROITE à GAUCHE (associativité droite).",
      "2 ** 3 ** 2  =  2 ** (3**2)  =  2 ** 9  =  512",
      "Attention : (2**3)**2 = 8**2 = 64  (différent !)",
    ],
  },
  {
    id: 7, niveau: 2,
    theme: "Priorité des opérateurs",
    code: `print(2 + 3 * 4 - 1)`,
    question: "Quelle est la sortie ?",
    options: ["19", "13", "20", "11"],
    correct: 1,
    explication: [
      "Ordre : * avant + et -",
      "3 * 4 = 12  d'abord",
      "2 + 12 - 1 = 13",
    ],
  },
  {
    id: 8, niveau: 2,
    theme: "Division entière négative",
    code: `print(-7 // 2)`,
    question: "Quelle est la sortie ?",
    options: ["-3", "-4", "3", "-3.5"],
    correct: 1,
    explication: [
      "// arrondit TOUJOURS vers -∞ (le plus petit entier inférieur).",
      "-7 / 2 = -3.5 → arrondir vers -∞ → -4",
      "Piège : on pourrait croire -3, mais c'est -4 !",
    ],
  },

  // ── Niveau 2 : Conversions et types ────────────────────────────────────
  {
    id: 9, niveau: 2,
    theme: "float() et str()",
    code: `x = float(input("x : "))  # saisie : "3.14"
print(type(x), x * 2)`,
    question: "Quelle est la sortie ?",
    options: [
      "<class 'str'> 6.28",
      "<class 'float'> 6.28",
      "<class 'float'> 3.143.14",
      "TypeError",
    ],
    correct: 1,
    explication: [
      "float() convertit le str \"3.14\" en 3.14 (float).",
      "x * 2 = 3.14 × 2 = 6.28",
      "type(x) = <class 'float'>",
    ],
  },
  {
    id: 10, niveau: 2,
    theme: "Concaténation vs addition",
    code: `a = "10"
b = "5"
print(a + b)
print(int(a) + int(b))`,
    question: "Quelles sont les deux sorties (dans l'ordre) ?",
    options: [
      "15 et 15",
      "105 et 15",
      "15 et 105",
      "TypeError et 15",
    ],
    correct: 1,
    explication: [
      "a + b  : str + str = concaténation → \"10\" + \"5\" = \"105\"",
      "int(a) + int(b) : 10 + 5 = 15  (addition d'entiers)",
      "Règle : + entre deux str = concaténation, pas addition.",
    ],
  },

  // ── Niveau 3 : Opérateurs augmentés ─────────────────────────────────────
  {
    id: 11, niveau: 3,
    theme: "Opérateurs augmentés — tracé",
    code: `x = 10
x += 5
x *= 2
x -= 3
print(x)`,
    question: "Quelle est la sortie ?",
    options: ["27", "17", "22", "32"],
    correct: 0,
    explication: [
      "x = 10",
      "x += 5  → x = 10 + 5 = 15",
      "x *= 2  → x = 15 × 2 = 30",
      "x -= 3  → x = 30 - 3 = 27",
    ],
  },
  {
    id: 12, niveau: 3,
    theme: "/= et type float",
    code: `x = 10
x /= 4
x *= 2
print(type(x), x)`,
    question: "Quelle est la sortie ?",
    options: [
      "<class 'int'> 5",
      "<class 'float'> 5.0",
      "<class 'float'> 4.0",
      "<class 'int'> 4",
    ],
    correct: 1,
    explication: [
      "/= donne TOUJOURS un float.",
      "x = 10 /= 4 → x = 2.5  (float)",
      "x = 2.5 *= 2 → x = 5.0  (reste float car déjà float)",
      "type(x) = float même si la valeur est entière.",
    ],
  },
  {
    id: 13, niveau: 3,
    theme: "//= et %= — caisse",
    code: `caisse = 105
nb = 25
caisse //= nb
print(caisse)`,
    question: "Quelle est la sortie ?",
    options: ["4.2", "5", "4", "105"],
    correct: 2,
    explication: [
      "//= : division entière en place.",
      "105 // 25 = 4  (25 entre 4 fois dans 105)",
      "105 = 4×25 + 5  →  quotient = 4, reste = 5",
      "Pour le reste : 105 % 25 = 5",
    ],
  },

  // ── Niveau 3 : round() et f-strings ─────────────────────────────────────
  {
    id: 14, niveau: 3,
    theme: "round() et f-string :.4f",
    code: `montant = 100.0
taux = 0.2937
result = montant * taux
print(f"{result:.4f}")`,
    question: "Quelle est la sortie ?",
    options: ["29.37", "29.3700", "0.2937", "29.37001"],
    correct: 1,
    explication: [
      "100.0 × 0.2937 = 29.37",
      ":.4f formate avec exactement 4 décimales.",
      "29.37 → affiché \"29.3700\" (4 chiffres après la virgule).",
      "Différence : round(29.37, 4) = 29.37  mais  f\":.4f\" = '29.3700'",
    ],
  },
  {
    id: 15, niveau: 3,
    theme: "Synthèse — zfill + // + %",
    code: `total = 7384
h = total // 3600
m = (total % 3600) // 60
s = total % 60
print(f"{str(h).zfill(2)}h {str(m).zfill(2)}min {str(s).zfill(2)}sec")`,
    question: "Quelle est la sortie ?",
    options: [
      "2h 3min 4sec",
      "02h 03min 04sec",
      "02h 3min 04sec",
      "2h 03min 4sec",
    ],
    correct: 1,
    explication: [
      "h = 7384 // 3600 = 2  →  zfill(2) → '02'",
      "m = (7384 % 3600) // 60 = 184 // 60 = 3  →  '03'",
      "s = 7384 % 60 = 4  →  '04'",
      "Sortie : 02h 03min 04sec",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════
const TEACHER_PWD = "iset2025";
const DB_KEY = "qcm_tp2";

const NIVEAU_STYLE = {
  1: { bg: "#E8F5E9", border: "#27AE60", color: "#1E7E4C", label: "Niveau 1 — Découverte" },
  2: { bg: "#E3F2FD", border: "#2E86C1", color: "#1A5276", label: "Niveau 2 — Priorité & types" },
  3: { bg: "#FFF3E0", border: "#E67E22", color: "#B07A00", label: "Niveau 3 — Augmentés & synthèse" },
};

// ═══════════════════════════════════════════════════════════════════════════
// FIREBASE HELPERS
// ═══════════════════════════════════════════════════════════════════════════
async function saveResult(studentName, answers) {
  const key = studentName.trim().replace(/\s+/g, "_").replace(/[.#$[\]]/g, "");
  await set(ref(db, `${DB_KEY}/${key}`), {
    name: studentName,
    answers,
    score: answers.filter((a) => a.correct).length,
    total: answers.length,
    submittedAt: new Date().toISOString(),
  });
}

async function clearAllResults() {
  await remove(ref(db, DB_KEY));
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT : Bloc de code Python
// ═══════════════════════════════════════════════════════════════════════════
function CodeBlock({ code }) {
  const lines = code.split("\n");
  return (
    <div style={{
      background: "#0D1F2D", borderRadius: 10, padding: "12px 16px",
      fontFamily: "'Courier New', monospace", fontSize: 13, lineHeight: 1.9,
      border: "1px solid #1A4A7A", marginBottom: 18, overflowX: "auto",
    }}>
      {lines.map((line, i) => {
        const isComment = line.trim().startsWith("#");
        const parts = [];
        if (isComment) {
          parts.push(<span key="c" style={{ color: "#4A8AA8", fontStyle: "italic" }}>{line}</span>);
        } else {
          const strRe = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
          let last = 0, m;
          while ((m = strRe.exec(line)) !== null) {
            if (m.index > last)
              parts.push(<span key={last} style={{ color: "#E8F4FB" }}>{line.slice(last, m.index)}</span>);
            parts.push(<span key={m.index} style={{ color: "#F0A500" }}>{m[0]}</span>);
            last = m.index + m[0].length;
          }
          if (last < line.length)
            parts.push(<span key={last} style={{ color: "#E8F4FB" }}>{line.slice(last)}</span>);
        }
        return (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <span style={{ color: "#2A5A7A", minWidth: 16, fontSize: 10, userSelect: "none", paddingTop: 2 }}>{i + 1}</span>
            <span>{parts}</span>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT : Tableau de bord enseignant
// ═══════════════════════════════════════════════════════════════════════════
function TeacherDashboard({ onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQ, setSelectedQ] = useState(null);

  useEffect(() => {
    const unsub = onValue(ref(db, DB_KEY), (snap) => {
      const data = snap.exists() ? Object.values(snap.val()) : [];
      data.sort((a, b) => b.score - a.score);
      setResults(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const total = results.length;
  const avgScore = total ? (results.reduce((s, r) => s + r.score, 0) / total).toFixed(1) : 0;
  const avgPct = total ? Math.round((results.reduce((s, r) => s + r.score / r.total, 0) / total) * 100) : 0;
  const finished = results.filter((r) => r.total === QUESTIONS.length).length;

  const qStats = QUESTIONS.map((q) => {
    const answered = results.filter((r) => r.answers?.find((a) => a.qid === q.id));
    const correct = results.filter((r) => r.answers?.find((a) => a.qid === q.id && a.correct));
    return { q, answered: answered.length, correct: correct.length, pct: answered.length ? Math.round((correct.length / answered.length) * 100) : null };
  });

  const FONT = "'Trebuchet MS', sans-serif";

  return (
    <div style={{ minHeight: "100vh", background: "#0D1F2D", fontFamily: FONT, color: "#E8F4FB" }}>
      {/* Header */}
      <div style={{ background: "#0F2A45", borderBottom: "3px solid #E67E22", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#E67E22" }}>📊 Tableau de bord — TP2 Module 2</h1>
          <p style={{ margin: 0, fontSize: 12, color: "#5B7A9A" }}>Variables · Types · Opérateurs · Temps réel Firebase</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={async () => { if (window.confirm("Effacer tous les résultats ?")) await clearAllResults(); }}
            style={{ background: "#C0392B", color: "#fff", border: "none", borderRadius: 7, padding: "7px 14px", cursor: "pointer", fontWeight: 700, fontSize: 12 }}>
            🗑 Réinitialiser
          </button>
          <button onClick={onBack} style={{ background: "#1A3A5A", color: "#5B7A9A", border: "none", borderRadius: 7, padding: "7px 14px", cursor: "pointer", fontSize: 12 }}>
            ← Retour
          </button>
        </div>
      </div>

      <div style={{ padding: "20px 24px" }}>
        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))", gap: 14, marginBottom: 22 }}>
          {[
            { label: "Étudiants", value: total, sub: "connectés", color: "#00B4D8", icon: "👥" },
            { label: "Score moyen", value: `${avgScore}/${QUESTIONS.length}`, sub: "bonnes rép.", color: "#2ECC71", icon: "📈" },
            { label: "Réussite", value: avgPct + "%", sub: "moyenne", color: "#E67E22", icon: "🎯" },
            { label: "Terminé", value: finished, sub: "étudiants", color: "#9B59B6", icon: "✅" },
          ].map((k, i) => (
            <div key={i} style={{ background: "#0F2A45", borderRadius: 12, padding: "16px 18px", border: `1px solid ${k.color}33` }}>
              <div style={{ fontSize: 22 }}>{k.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: k.color }}>{loading ? "…" : k.value}</div>
              <div style={{ fontSize: 11, color: "#5B7A9A" }}>{k.label}</div>
              <div style={{ fontSize: 10, color: k.color }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {/* Classement */}
          <div style={{ background: "#0F2A45", borderRadius: 12, padding: 18, border: "1px solid #1A4A7A" }}>
            <h3 style={{ margin: "0 0 14px", color: "#E67E22", fontSize: 15 }}>🏆 Classement en direct</h3>
            {loading ? <p style={{ color: "#5B7A9A" }}>Connexion Firebase…</p>
              : results.length === 0 ? <p style={{ color: "#5B7A9A", fontSize: 13 }}>En attente des résultats…</p>
              : (
                <div style={{ maxHeight: 320, overflowY: "auto" }}>
                  {results.map((r, i) => {
                    const pct = Math.round((r.score / r.total) * 100);
                    const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
                    return (
                      <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid #1A3A5A" }}>
                        <span style={{ fontSize: 14, minWidth: 26 }}>{medal}</span>
                        <span style={{ flex: 1, fontSize: 13, fontWeight: i < 3 ? 700 : 400, color: i < 3 ? "#E8F4FB" : "#8AACBF" }}>{r.name}</span>
                        <span style={{ fontSize: 12, color: pct >= 70 ? "#2ECC71" : pct >= 50 ? "#E67E22" : "#E74C3C", fontWeight: 700 }}>{r.score}/{r.total}</span>
                        <div style={{ width: 55 }}>
                          <div style={{ background: "#1A3A5A", borderRadius: 4, height: 5, overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: pct >= 70 ? "#2ECC71" : pct >= 50 ? "#E67E22" : "#E74C3C", transition: "width 0.5s" }} />
                          </div>
                          <div style={{ fontSize: 9, color: "#5B7A9A", textAlign: "right", marginTop: 1 }}>{pct}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
          </div>

          {/* Stats par question */}
          <div style={{ background: "#0F2A45", borderRadius: 12, padding: 18, border: "1px solid #1A4A7A" }}>
            <h3 style={{ margin: "0 0 14px", color: "#00B4D8", fontSize: 15 }}>📋 Résultats par question</h3>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {qStats.map(({ q, answered, pct }) => (
                <div key={q.id} onClick={() => setSelectedQ(selectedQ?.id === q.id ? null : q)}
                  style={{ padding: "7px 0", borderBottom: "1px solid #1A3A5A", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                    <span style={{ background: NIVEAU_STYLE[q.niveau].border + "33", color: NIVEAU_STYLE[q.niveau].border, borderRadius: 4, padding: "1px 5px", fontSize: 9, fontWeight: 700 }}>N{q.niveau}</span>
                    <span style={{ flex: 1, fontSize: 12, color: "#8AACBF" }}>Q{q.id} — {q.theme}</span>
                    <span style={{ fontSize: 11, color: "#5B7A9A" }}>{answered}</span>
                    {pct !== null && <span style={{ fontSize: 11, fontWeight: 700, color: pct >= 70 ? "#2ECC71" : pct >= 50 ? "#E67E22" : "#E74C3C" }}>{pct}%</span>}
                  </div>
                  {pct !== null && (
                    <div style={{ background: "#1A3A5A", borderRadius: 4, height: 4, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: pct >= 70 ? "#2ECC71" : pct >= 50 ? "#E67E22" : "#E74C3C", transition: "width 0.5s" }} />
                    </div>
                  )}
                  {selectedQ?.id === q.id && (
                    <div style={{ marginTop: 8, background: "#0A1A2A", borderRadius: 8, padding: 10 }}>
                      <p style={{ margin: "0 0 5px", fontSize: 11, color: "#E67E22", fontWeight: 700 }}>{q.question}</p>
                      {q.options.map((opt, oi) => {
                        const chosenBy = results.filter((r) => r.answers?.find((a) => a.qid === q.id && a.chosen === oi)).length;
                        return (
                          <div key={oi} style={{ display: "flex", gap: 5, margin: "2px 0", alignItems: "center" }}>
                            <span style={{ fontSize: 10, color: oi === q.correct ? "#2ECC71" : "#5B7A9A", minWidth: 12 }}>{oi === q.correct ? "✓" : "·"}</span>
                            <span style={{ fontSize: 10, color: oi === q.correct ? "#2ECC71" : "#5B7A9A", flex: 1 }}>{opt}</span>
                            <span style={{ fontSize: 10, color: "#5B7A9A" }}>{chosenBy}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT : QCM Étudiant
// ═══════════════════════════════════════════════════════════════════════════
function StudentQCM({ studentName }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const TIME_LIMIT = 60; // secondes par question
  const [timer, setTimer] = useState(TIME_LIMIT);
  const [timedOut, setTimedOut] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const q = QUESTIONS[current];
  const niv = NIVEAU_STYLE[q?.niveau] || NIVEAU_STYLE[1];

  // Réinitialiser à chaque nouvelle question
  useEffect(() => {
    setSelected(null);
    setConfirmed(false);
    setShowExp(false);
    setTimer(TIME_LIMIT);
    setTimedOut(false);
  }, [current]);

  // Compte à rebours — passage automatique à 0
  useEffect(() => {
    if (confirmed || finished) return;
    if (timer <= 0) {
      // Temps écoulé → réponse marquée incorrecte, passage automatique
      setTimedOut(true);
      setConfirmed(true);
      setAnswers((prev) => [
        ...prev,
        { qid: q.id, chosen: null, correct: false, time: TIME_LIMIT, timedOut: true },
      ]);
      return;
    }
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer, confirmed, finished, current]);

  const handleConfirm = () => {
    if (selected === null) return;
    setConfirmed(true);
    setAnswers((prev) => [
      ...prev,
      { qid: q.id, chosen: selected, correct: selected === q.correct, time: TIME_LIMIT - timer, timedOut: false },
    ]);
  };

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) setCurrent((c) => c + 1);
    else setFinished(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await saveResult(studentName, answers); setSubmitted(true); }
    catch { alert("Erreur d'envoi. Vérifiez votre connexion."); }
    finally { setSubmitting(false); }
  };

  const score = answers.filter((a) => a.correct).length;
  const pct = finished ? Math.round((score / QUESTIONS.length) * 100) : 0;
  const progress = (current / QUESTIONS.length) * 100;
  const FONT = "'Trebuchet MS', sans-serif";

  // ── Écran résultats ──
  if (finished) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#EAF4FB,#F4F9FD)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 20 }}>
        <div style={{ background: "#fff", borderRadius: 18, padding: "36px 44px", maxWidth: 520, width: "100%", boxShadow: "0 8px 40px #1A5276 22", textAlign: "center" }}>
          <div style={{ fontSize: 58, marginBottom: 10 }}>{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪"}</div>
          <h2 style={{ fontSize: 26, color: "#1A5276", margin: "0 0 4px" }}>{studentName}</h2>
          <p style={{ color: "#5B7A9A", marginBottom: 24, fontSize: 14 }}>TP2 — Variables, Types & Opérateurs</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 22 }}>
            {[
              { val: `${score}/${QUESTIONS.length}`, label: "Réponses", bg: "#E3F2FD", color: "#1A5276" },
              { val: `${pct}%`, label: "Score", bg: pct >= 80 ? "#E8F5E9" : pct >= 60 ? "#FFF3E0" : "#FDECEA", color: pct >= 80 ? "#1E7E4C" : pct >= 60 ? "#B07A00" : "#C0392B" },
              { val: `${Math.round(answers.reduce((s, a) => s + a.time, 0) / answers.length)}s`, label: "Moy./question", bg: "#F3E5F5", color: "#6C3483" },
            ].map((k, i) => (
              <div key={i} style={{ background: k.bg, borderRadius: 10, padding: "14px 18px" }}>
                <div style={{ fontSize: 30, fontWeight: 800, color: k.color }}>{k.val}</div>
                <div style={{ fontSize: 11, color: "#5B7A9A" }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Détail par question */}
          <div style={{ background: "#F8FBFE", borderRadius: 10, padding: "10px 14px", marginBottom: 20, textAlign: "left" }}>
            {QUESTIONS.map((qq, i) => {
              const ans = answers.find((a) => a.qid === qq.id);
              return (
                <div key={qq.id} style={{ display: "flex", gap: 7, padding: "4px 0", borderBottom: i < QUESTIONS.length - 1 ? "1px solid #EEF4F8" : "none", alignItems: "center" }}>
                  <span style={{ fontSize: 13 }}>{ans?.timedOut ? "⏰" : ans?.correct ? "✅" : "❌"}</span>
                  <span style={{ flex: 1, fontSize: 11, color: "#1A2E40" }}>Q{i + 1} — {qq.theme}</span>
                  <span style={{ fontSize: 10, color: ans?.timedOut ? "#E67E22" : "#5B7A9A", fontWeight: ans?.timedOut ? 700 : 400 }}>
                    {ans?.timedOut ? "Temps !" : `${ans?.time}s`}
                  </span>
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <button onClick={handleSubmit} disabled={submitting}
              style={{ background: submitting ? "#AAA" : "#1A5276", color: "#fff", border: "none", borderRadius: 9, padding: "13px 32px", fontSize: 15, fontWeight: 700, cursor: submitting ? "default" : "pointer", width: "100%" }}>
              {submitting ? "⏳ Envoi…" : "📤 Envoyer à l'enseignant"}
            </button>
          ) : (
            <div style={{ background: "#E8F5E9", border: "1px solid #2ECC71", borderRadius: 9, padding: 14, color: "#1E7E4C", fontWeight: 700 }}>
              ✅ Résultats envoyés !
            </div>
          )}
        </div>
      </div>
    );
  }

  const isCorrect = confirmed && selected === q.correct;

  // ── Écran question ──
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#EAF4FB,#F4F9FD)", fontFamily: FONT, padding: "18px 14px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10, flexWrap: "wrap", gap: 7 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 16, color: "#1A5276", fontWeight: 800 }}>QCM TP2 — Module 2</h1>
            <p style={{ margin: 0, fontSize: 11, color: "#5B7A9A" }}>👤 {studentName}</p>
          </div>
          <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ background: "#E3F2FD", color: "#1A5276", borderRadius: 7, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>
              Q{current + 1}/{QUESTIONS.length}
            </span>
            {/* Compte à rebours */}
            <span style={{
              background: timer <= 10 ? "#FDECEA" : timer <= 20 ? "#FFF3E0" : "#F8FBFE",
              color: timer <= 10 ? "#C0392B" : timer <= 20 ? "#E67E22" : "#5B7A9A",
              border: `2px solid ${timer <= 10 ? "#E74C3C" : timer <= 20 ? "#E67E22" : "#DDE7F0"}`,
              borderRadius: 7, padding: "3px 10px", fontSize: 13, fontWeight: 800,
              minWidth: 52, textAlign: "center",
              animation: timer <= 10 && !confirmed ? "pulse 1s infinite" : "none",
            }}>
              {confirmed ? "⏹" : timedOut ? "⏰ 0s" : `⏱ ${timer}s`}
            </span>
            {answers.length > 0 && (
              <span style={{ background: "#E8F5E9", color: "#1E7E4C", borderRadius: 7, padding: "3px 9px", fontSize: 12, fontWeight: 700, border: "1px solid #2ECC71" }}>
                ✅ {score}/{answers.length}
              </span>
            )}
          </div>
        </div>

        {/* Barre de progression de la question (compte à rebours visuel) */}
        {!confirmed && (
          <div style={{ background: "#DDE7F0", borderRadius: 7, height: 7, marginBottom: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              width: `${(timer / TIME_LIMIT) * 100}%`,
              background: timer <= 10 ? "#E74C3C" : timer <= 20 ? "#E67E22" : "linear-gradient(90deg,#1A5276,#00B4D8)",
              transition: "width 1s linear, background 0.3s",
            }} />
          </div>
        )}

        {/* Barre de progression globale */}
        <div style={{ background: "#EEF4F8", borderRadius: 7, height: 4, marginBottom: 14, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "#1A5276", transition: "width 0.4s" }} />
        </div>

        {/* Animation CSS pour le clignotement */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.05); }
          }
        `}</style>

        {/* Badges */}
        <div style={{ display: "flex", gap: 7, marginBottom: 14, flexWrap: "wrap" }}>
          <span style={{ background: niv.bg, color: niv.color, border: `1px solid ${niv.border}`, borderRadius: 5, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{niv.label}</span>
          <span style={{ background: "#F8FBFE", color: "#5B7A9A", border: "1px solid #DDE7F0", borderRadius: 5, padding: "2px 9px", fontSize: 11 }}>{q.theme}</span>
        </div>

        {/* Card question */}
        <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 4px 20px #1A527612", padding: "22px 24px", marginBottom: 14 }}>
          <CodeBlock code={q.code} />
          <p style={{ fontSize: 16, fontWeight: 700, color: "#1A2E40", marginBottom: 16 }}>{q.question}</p>

          {/* Options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9 }}>
            {q.options.map((opt, i) => {
              let bg = selected === i ? "#E3F2FD" : "#F8FBFE";
              let border = selected === i ? "2px solid #1A5276" : "2px solid #DDE7F0";
              let color = selected === i ? "#1A5276" : "#1A2E40";
              let badgeBg = selected === i ? "#1A5276" : "#DDE7F0";
              let badgeColor = selected === i ? "#fff" : "#5B7A9A";

              if (confirmed) {
                if (i === q.correct) { bg = "#E8F5E9"; border = "2px solid #27AE60"; color = "#1E7E4C"; badgeBg = "#27AE60"; badgeColor = "#fff"; }
                else if (i === selected) { bg = "#FDECEA"; border = "2px solid #E74C3C"; color = "#C0392B"; badgeBg = "#E74C3C"; badgeColor = "#fff"; }
                else { bg = "#F8FBFE"; border = "2px solid #DDE7F0"; color = "#AAA"; badgeBg = "#EEE"; badgeColor = "#AAA"; }
              }

              return (
                <button key={i} onClick={() => !confirmed && setSelected(i)}
                  style={{ background: bg, border, borderRadius: 9, padding: "10px 12px", textAlign: "left", cursor: confirmed ? "default" : "pointer", display: "flex", alignItems: "center", gap: 9, transition: "all 0.18s" }}>
                  <span style={{ width: 22, height: 22, borderRadius: 5, background: badgeBg, color: badgeColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12, color, fontWeight: confirmed && i === q.correct ? 700 : 400, wordBreak: "break-all" }}>
                    {opt}
                  </span>
                  {confirmed && i === q.correct && <span style={{ marginLeft: "auto" }}>✅</span>}
                  {confirmed && i === selected && i !== q.correct && <span style={{ marginLeft: "auto" }}>❌</span>}
                </button>
              );
            })}
          </div>

          {/* Feedback + explication */}
          {confirmed && (
            <div style={{ marginTop: 14 }}>
              <div style={{
                background: timedOut ? "#FFF3E0" : isCorrect ? "#E8F5E9" : "#FDECEA",
                border: `1px solid ${timedOut ? "#E67E22" : isCorrect ? "#27AE60" : "#E74C3C"}`,
                borderRadius: 9, padding: "9px 12px", display: "flex", alignItems: "center", gap: 7, marginBottom: 9,
              }}>
                <span style={{ fontSize: 18 }}>{timedOut ? "⏰" : isCorrect ? "🎉" : "😅"}</span>
                <div>
                  <span style={{ fontWeight: 700, color: timedOut ? "#E67E22" : isCorrect ? "#1E7E4C" : "#C0392B", fontSize: 13 }}>
                    {timedOut
                      ? "Temps écoulé ! Passage automatique."
                      : isCorrect
                      ? "Bonne réponse !"
                      : `Incorrect — Réponse : ${q.options[q.correct]}`}
                  </span>
                  {timedOut && (
                    <div style={{ fontSize: 11, color: "#B07A00", marginTop: 2 }}>
                      Réponse correcte : <strong style={{ fontFamily: "Courier New" }}>{q.options[q.correct]}</strong>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => setShowExp((v) => !v)}
                style={{ background: "none", border: "1px solid #1A5276", color: "#1A5276", borderRadius: 7, padding: "4px 11px", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
                {showExp ? "▲ Masquer" : "▼ Explication PCEP"}
              </button>
              {showExp && (
                <div style={{ marginTop: 9, background: "#F8FBFE", border: "1px solid #DDE7F0", borderRadius: 9, padding: "11px 13px" }}>
                  {q.explication.map((l, i) => (
                    <p key={i} style={{ margin: "2px 0", fontSize: 12, color: "#1A2E40", fontFamily: l.startsWith("→") || l.includes("=") || l.includes("print") || l.includes("int(") || l.includes("float(") ? "'Courier New'" : "inherit" }}>
                      {l}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Boutons navigation */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {!confirmed ? (
            <button onClick={handleConfirm} disabled={selected === null}
              style={{ background: selected !== null ? "#1A5276" : "#DDE7F0", color: selected !== null ? "#fff" : "#5B7A9A", border: "none", borderRadius: 9, padding: "11px 26px", fontSize: 14, fontWeight: 700, cursor: selected !== null ? "pointer" : "default" }}>
              ✔ Valider
            </button>
          ) : (
            <button onClick={handleNext}
              style={{ background: "#1A5276", color: "#fff", border: "none", borderRadius: 9, padding: "11px 26px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              {current < QUESTIONS.length - 1 ? "Question suivante →" : "Voir mes résultats 🏆"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT : Écran de connexion
// ═══════════════════════════════════════════════════════════════════════════
function LoginScreen({ onStudent, onTeacher }) {
  const [name, setName] = useState("");
  const [teacherMode, setTeacherMode] = useState(false);
  const [pwd, setPwd] = useState("");
  const [pwdError, setPwdError] = useState(false);
  const FONT = "'Trebuchet MS', sans-serif";

  const handleTeacher = () => {
    if (pwd === TEACHER_PWD) onTeacher();
    else setPwdError(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0D1F2D 0%,#0F2A45 60%,#1A4A7A 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 450 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🐍</div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: "#E67E22", margin: "0 0 4px", letterSpacing: 1 }}>QCM TP2</h1>
          <p style={{ color: "#5B7A9A", fontSize: 14, margin: "0 0 10px" }}>PCEP — Module 2 · Variables, Types & Opérateurs</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
            {[1, 2, 3].map((n) => (
              <span key={n} style={{ background: NIVEAU_STYLE[n].border + "22", color: NIVEAU_STYLE[n].border, border: `1px solid ${NIVEAU_STYLE[n].border}`, borderRadius: 5, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>
                N{n}
              </span>
            ))}
            <span style={{ background: "#1A4A7A", color: "#AED6F1", borderRadius: 5, padding: "2px 9px", fontSize: 10, fontWeight: 700 }}>
              {QUESTIONS.length} questions
            </span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "#0F2A45", borderRadius: 18, padding: "28px 32px", boxShadow: "0 20px 60px #0008", border: "1px solid #1A4A7A" }}>
          {!teacherMode ? (
            <>
              <h2 style={{ margin: "0 0 4px", color: "#E8F4FB", fontSize: 17 }}>👤 Connexion étudiant</h2>
              <p style={{ color: "#5B7A9A", fontSize: 12, marginBottom: 20 }}>{QUESTIONS.length} questions · 3 niveaux · résultats envoyés en temps réel</p>
              <label style={{ display: "block", color: "#8AACBF", fontSize: 12, marginBottom: 7, fontWeight: 600 }}>Nom & Prénom</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && name.trim().length >= 3 && onStudent(name.trim())}
                placeholder="ex : Ben Ali Mohamed"
                style={{ width: "100%", padding: "11px 13px", borderRadius: 9, border: "2px solid #1A4A7A", background: "#0A1A2A", color: "#E8F4FB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: FONT }} />
              <p style={{ color: "#3A6A8A", fontSize: 10, marginBottom: 18 }}>Minimum 3 caractères</p>
              <button onClick={() => onStudent(name.trim())} disabled={name.trim().length < 3}
                style={{ width: "100%", background: name.trim().length >= 3 ? "linear-gradient(90deg,#1A5276,#00B4D8)" : "#1A3A5A", color: name.trim().length >= 3 ? "#fff" : "#3A6A8A", border: "none", borderRadius: 9, padding: "13px", fontSize: 15, fontWeight: 800, cursor: name.trim().length >= 3 ? "pointer" : "default", transition: "all 0.2s" }}>
                🚀 Démarrer le QCM
              </button>
              <button onClick={() => setTeacherMode(true)}
                style={{ width: "100%", background: "none", color: "#3A6A8A", border: "1px solid #1A3A5A", borderRadius: 9, padding: "9px", fontSize: 12, cursor: "pointer", marginTop: 10 }}>
                🔐 Accès enseignant
              </button>
            </>
          ) : (
            <>
              <h2 style={{ margin: "0 0 4px", color: "#E67E22", fontSize: 17 }}>🔐 Accès enseignant</h2>
              <p style={{ color: "#5B7A9A", fontSize: 12, marginBottom: 18 }}>Tableau de bord avec résultats en temps réel</p>
              <label style={{ display: "block", color: "#8AACBF", fontSize: 12, marginBottom: 7, fontWeight: 600 }}>Mot de passe</label>
              <input type="password" value={pwd}
                onChange={(e) => { setPwd(e.target.value); setPwdError(false); }}
                onKeyDown={(e) => e.key === "Enter" && handleTeacher()}
                placeholder="••••••••"
                style={{ width: "100%", padding: "11px 13px", borderRadius: 9, border: `2px solid ${pwdError ? "#E74C3C" : "#1A4A7A"}`, background: "#0A1A2A", color: "#E8F4FB", fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: FONT }} />
              {pwdError && <p style={{ color: "#E74C3C", fontSize: 11, margin: "4px 0 8px" }}>Mot de passe incorrect</p>}
              <p style={{ color: "#3A6A8A", fontSize: 10, marginBottom: 18 }}>Indice : iset + année</p>
              <button onClick={handleTeacher}
                style={{ width: "100%", background: "linear-gradient(90deg,#E67E22,#D35400)", color: "#0F2A45", border: "none", borderRadius: 9, padding: "13px", fontSize: 15, fontWeight: 800, cursor: "pointer" }}>
                📊 Tableau de bord
              </button>
              <button onClick={() => { setTeacherMode(false); setPwd(""); setPwdError(false); }}
                style={{ width: "100%", background: "none", color: "#3A6A8A", border: "1px solid #1A3A5A", borderRadius: 9, padding: "9px", fontSize: 12, cursor: "pointer", marginTop: 10 }}>
                ← Retour
              </button>
            </>
          )}
        </div>
        <p style={{ textAlign: "center", color: "#2A4A6A", fontSize: 10, marginTop: 14 }}>
          Résultats synchronisés en temps réel · Firebase · GitHub Pages
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function App({ onBack }) {
  const [mode, setMode] = useState("login");
  const [studentName, setStudentName] = useState("");

  if (mode === "teacher") return <TeacherDashboard onBack={() => setMode("login")} />;
  if (mode === "student") return <StudentQCM studentName={studentName} />;
  return (
    <LoginScreen
      onStudent={(name) => { setStudentName(name); setMode("student"); }}
      onTeacher={() => setMode("teacher")}
    />
  );
}
