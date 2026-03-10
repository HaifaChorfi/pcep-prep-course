import { useState, useEffect, useCallback } from "react";

// ══════════════════════════════════════════════════
// QUESTIONS
// ══════════════════════════════════════════════════
const QUESTIONS = [
  {
    id: 1, niveau: 1, theme: "print() basique",
    code: `print("A", "B", "C", sep="", end="!")`,
    question: "Quelle est la sortie exacte ?",
    options: ["A B C!", "ABC!", "A B C !", "A-B-C!"],
    correct: 1,
    explication: `sep="" supprime l'espace → ABC\nend="!" remplace \\n → ABC!`,
  },
  {
    id: 2, niveau: 1, theme: "Types littéraux",
    code: `print(type("3.14"))`,
    question: "Quelle est la sortie ?",
    options: ["<class 'float'>", "<class 'int'>", "<class 'str'>", "3.14"],
    correct: 2,
    explication: `"3.14" est entre guillemets → str\nPeu importe le contenu, les guillemets définissent le type.`,
  },
  {
    id: 3, niveau: 1, theme: "print() vide",
    code: `print()`,
    question: "Que produit ce code ?",
    options: ["Rien du tout", "None", "Une ligne vide", "SyntaxError"],
    correct: 2,
    explication: `print() sans argument affiche une ligne vide (le \\n de end= par défaut).`,
  },
  {
    id: 4, niveau: 2, theme: "Bases numériques",
    code: `print(0b101, 0o7, 0xA, sep=" | ")`,
    question: "Quelle est la sortie ?",
    options: ["101 | 7 | A", "5 | 7 | 10", "0b101 | 0o7 | 0xA", "5 | 7 | A"],
    correct: 1,
    explication: `0b101=5, 0o7=7, 0xA=10\nPython convertit en décimal pour l'affichage.`,
  },
  {
    id: 5, niveau: 2, theme: "Octal",
    code: `print(0o10)`,
    question: "Quelle valeur est affichée ?",
    options: ["10", "8", "2", "16"],
    correct: 1,
    explication: `0o10 = 1×8 + 0×1 = 8 en décimal.\n0o → O comme Octal, base 8.`,
  },
  {
    id: 6, niveau: 2, theme: "Concaténation str",
    code: `x = "3" + "14"\nprint(type(x), x)`,
    question: "Quelle est la sortie ?",
    options: ["<class 'int'> 17", "<class 'str'> 314", "<class 'float'> 3.14", "TypeError"],
    correct: 1,
    explication: `"3" + "14" = concaténation (str + str)\nx = "314", pas 17 (addition).`,
  },
  {
    id: 7, niveau: 2, theme: "bool & int",
    code: `print(True + True + False)`,
    question: "Quelle est la sortie ?",
    options: ["TrueTrueFalse", "2", "True", "TypeError"],
    correct: 1,
    explication: `bool hérite de int : True=1, False=0\n1 + 1 + 0 = 2`,
  },
  {
    id: 8, niveau: 3, theme: "TypeError",
    code: `print("Résultat : " + 100)`,
    question: "Quel type d'erreur est levé ?",
    options: ["SyntaxError", "NameError", "TypeError", "ValueError"],
    correct: 2,
    explication: `str + int → TypeError\nCorrection : print("Résultat :", 100)`,
  },
  {
    id: 9, niveau: 3, theme: "Casse & NameError",
    code: `Print("Bonjour")`,
    question: "Quel type d'erreur est levé ?",
    options: ["SyntaxError", "NameError", "TypeError", "Aucune erreur"],
    correct: 1,
    explication: `Python est sensible à la casse.\nPrint ≠ print → NameError.`,
  },
  {
    id: 10, niveau: 3, theme: "Shell vs Script",
    code: `# Mode SCRIPT\n40 + 2\nprint("Fin")`,
    question: "Quelle est la sortie du script ?",
    options: ["42\nFin", "Fin", "42", "42 Fin"],
    correct: 1,
    explication: `En script, les expressions sans print() ne s'affichent pas.\n40+2 est calculé mais non affiché → seul "Fin" sort.`,
  },
];

const NIVEAU_STYLE = {
  1: { bg: "#E8F5E9", border: "#2ECC71", color: "#1E7E4C", label: "Niveau 1 — Découverte" },
  2: { bg: "#E3F2FD", border: "#1A6FA8", color: "#0F4C81", label: "Niveau 2 — Types" },
  3: { bg: "#FFF3E0", border: "#F0A500", color: "#B07A00", label: "Niveau 3 — Débogage" },
};

// ══════════════════════════════════════════════════
// STORAGE HELPERS
// ══════════════════════════════════════════════════
const RESULTS_KEY = "qcm_tp1_results";
const SESSION_KEY = "qcm_tp1_session";

async function saveResult(studentName, answers) {
  try {
    const key = `${RESULTS_KEY}:${studentName.replace(/\s+/g, "_")}`;
    await window.storage.set(key, JSON.stringify({
      name: studentName,
      answers,
      score: answers.filter(a => a.correct).length,
      total: answers.length,
      submittedAt: new Date().toISOString(),
    }), true);
  } catch (e) { console.error(e); }
}

async function loadAllResults() {
  try {
    const { keys } = await window.storage.list(RESULTS_KEY + ":", true);
    const results = [];
    for (const key of keys) {
      try {
        const r = await window.storage.get(key, true);
        if (r) results.push(JSON.parse(r.value));
      } catch {}
    }
    return results;
  } catch { return []; }
}

async function clearAllResults() {
  try {
    const { keys } = await window.storage.list(RESULTS_KEY + ":", true);
    for (const key of keys) {
      try { await window.storage.delete(key, true); } catch {}
    }
  } catch {}
}

// ══════════════════════════════════════════════════
// CODE DISPLAY
// ══════════════════════════════════════════════════
function CodeBlock({ code }) {
  const lines = code.split("\n");
  return (
    <div style={{
      background: "#0D1F2D", borderRadius: 12, padding: "14px 18px",
      fontFamily: "'Courier New', monospace", fontSize: 14, lineHeight: 1.8,
      border: "1px solid #1A4A7A", boxShadow: "0 4px 20px #0004",
      marginBottom: 20, overflowX: "auto",
    }}>
      {lines.map((line, i) => {
        // Basic colorize
        let parts = [];
        let rest = line;
        if (rest.trim().startsWith("#")) {
          parts.push(<span key="c" style={{ color: "#4A7A9A", fontStyle: "italic" }}>{rest}</span>);
        } else {
          // highlight strings
          const strRe = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
          let last = 0, m;
          let tmp = [];
          while ((m = strRe.exec(rest)) !== null) {
            if (m.index > last) tmp.push(<span key={last} style={{ color: "#E8F4FB" }}>{rest.slice(last, m.index)}</span>);
            tmp.push(<span key={m.index} style={{ color: "#F0A500" }}>{m[0]}</span>);
            last = m.index + m[0].length;
          }
          if (last < rest.length) tmp.push(<span key={last} style={{ color: "#E8F4FB" }}>{rest.slice(last)}</span>);
          // highlight keywords
          parts = tmp;
        }
        return (
          <div key={i} style={{ display: "flex", gap: 12 }}>
            <span style={{ color: "#2A5A7A", minWidth: 18, fontSize: 11, userSelect: "none", paddingTop: 2 }}>{i + 1}</span>
            <span>{parts}</span>
          </div>
        );
      })}
    </div>
  );
}

// ══════════════════════════════════════════════════
// TEACHER DASHBOARD
// ══════════════════════════════════════════════════
function TeacherDashboard({ onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQ, setSelectedQ] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await loadAllResults();
    data.sort((a, b) => b.score - a.score);
    setResults(data);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); const id = setInterval(refresh, 4000); return () => clearInterval(id); }, [refresh]);

  const total = results.length;
  const avgScore = total ? (results.reduce((s, r) => s + r.score, 0) / total).toFixed(1) : 0;
  const avgPct = total ? Math.round((results.reduce((s, r) => s + r.score / r.total, 0) / total) * 100) : 0;

  // Per-question stats
  const qStats = QUESTIONS.map(q => {
    const answered = results.filter(r => r.answers.find(a => a.qid === q.id));
    const correct = results.filter(r => r.answers.find(a => a.qid === q.id && a.correct));
    return {
      q, answered: answered.length,
      correct: correct.length,
      pct: answered.length ? Math.round((correct.length / answered.length) * 100) : null,
    };
  });

  return (
    <div style={{ minHeight: "100vh", background: "#0D1F2D", fontFamily: "'Trebuchet MS', sans-serif", color: "#E8F4FB" }}>
      {/* Header */}
      <div style={{ background: "#0F2A45", borderBottom: "3px solid #F0A500", padding: "16px 28px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#F0A500" }}>📊 Tableau de bord — Enseignant</h1>
          <p style={{ margin: 0, fontSize: 13, color: "#5B7A9A" }}>QCM TP1 · Python Essentials 1 · Actualisation auto toutes les 4s</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={refresh} style={{ background: "#1A6FA8", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
            🔄 Actualiser
          </button>
          <button onClick={async () => { if (window.confirm("Effacer tous les résultats ?")) { await clearAllResults(); refresh(); } }}
            style={{ background: "#C0392B", color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
            🗑 Réinitialiser
          </button>
          <button onClick={onBack} style={{ background: "#1A3A5A", color: "#5B7A9A", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontSize: 13 }}>
            ← Retour
          </button>
        </div>
      </div>

      <div style={{ padding: "24px 28px" }}>
        {/* KPIs */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Étudiants connectés", value: total, sub: "/ 25", color: "#00B4D8", icon: "👥" },
            { label: "Score moyen", value: avgScore, sub: `/ ${QUESTIONS.length}`, color: "#2ECC71", icon: "📈" },
            { label: "Réussite moyenne", value: avgPct + "%", sub: "des réponses", color: "#F0A500", icon: "🎯" },
            { label: "Terminé", value: results.filter(r => r.total === QUESTIONS.length).length, sub: "étudiants", color: "#9B59B6", icon: "✅" },
          ].map((k, i) => (
            <div key={i} style={{ background: "#0F2A45", borderRadius: 14, padding: "18px 20px", border: `1px solid ${k.color}33` }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{k.icon}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: k.color }}>{loading ? "…" : k.value}</div>
              <div style={{ fontSize: 12, color: "#5B7A9A" }}>{k.label}</div>
              <div style={{ fontSize: 11, color: k.color }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Classement */}
          <div style={{ background: "#0F2A45", borderRadius: 14, padding: "20px", border: "1px solid #1A4A7A" }}>
            <h3 style={{ margin: "0 0 16px", color: "#F0A500", fontSize: 16 }}>🏆 Classement</h3>
            {loading ? <p style={{ color: "#5B7A9A" }}>Chargement…</p> : results.length === 0 ? (
              <p style={{ color: "#5B7A9A", fontSize: 13 }}>Aucun résultat pour l'instant.<br />Les étudiants doivent soumettre leur QCM.</p>
            ) : (
              <div style={{ maxHeight: 320, overflowY: "auto" }}>
                {results.map((r, i) => {
                  const pct = Math.round((r.score / r.total) * 100);
                  const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}.`;
                  return (
                    <div key={r.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #1A3A5A" }}>
                      <span style={{ fontSize: 16, minWidth: 28 }}>{medal}</span>
                      <span style={{ flex: 1, fontSize: 14, fontWeight: i < 3 ? 700 : 400, color: i < 3 ? "#E8F4FB" : "#8AACBF" }}>{r.name}</span>
                      <span style={{ fontSize: 13, color: pct >= 70 ? "#2ECC71" : pct >= 50 ? "#F0A500" : "#E74C3C", fontWeight: 700 }}>
                        {r.score}/{r.total}
                      </span>
                      <div style={{ width: 60 }}>
                        <div style={{ background: "#1A3A5A", borderRadius: 4, height: 6, overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: pct >= 70 ? "#2ECC71" : pct >= 50 ? "#F0A500" : "#E74C3C", transition: "width 0.5s" }} />
                        </div>
                        <div style={{ fontSize: 10, color: "#5B7A9A", textAlign: "right", marginTop: 2 }}>{pct}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats par question */}
          <div style={{ background: "#0F2A45", borderRadius: 14, padding: "20px", border: "1px solid #1A4A7A" }}>
            <h3 style={{ margin: "0 0 16px", color: "#00B4D8", fontSize: 16 }}>📋 Résultats par question</h3>
            <div style={{ maxHeight: 320, overflowY: "auto" }}>
              {qStats.map(({ q, answered, correct, pct }) => (
                <div key={q.id} onClick={() => setSelectedQ(selectedQ?.id === q.id ? null : q)}
                  style={{ padding: "8px 0", borderBottom: "1px solid #1A3A5A", cursor: "pointer" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{
                      background: NIVEAU_STYLE[q.niveau].border + "33",
                      color: NIVEAU_STYLE[q.niveau].border,
                      borderRadius: 4, padding: "1px 6px", fontSize: 10, fontWeight: 700
                    }}>N{q.niveau}</span>
                    <span style={{ flex: 1, fontSize: 13, color: "#8AACBF" }}>Q{q.id} — {q.theme}</span>
                    <span style={{ fontSize: 12, color: "#5B7A9A" }}>{answered} réponses</span>
                    {pct !== null && (
                      <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 70 ? "#2ECC71" : pct >= 50 ? "#F0A500" : "#E74C3C" }}>
                        {pct}%
                      </span>
                    )}
                  </div>
                  {pct !== null && (
                    <div style={{ background: "#1A3A5A", borderRadius: 4, height: 5, overflow: "hidden" }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: pct >= 70 ? "#2ECC71" : pct >= 50 ? "#F0A500" : "#E74C3C", transition: "width 0.5s" }} />
                    </div>
                  )}
                  {selectedQ?.id === q.id && (
                    <div style={{ marginTop: 8, background: "#0A1A2A", borderRadius: 8, padding: 10 }}>
                      <p style={{ margin: "0 0 6px", fontSize: 12, color: "#F0A500", fontWeight: 700 }}>{q.question}</p>
                      {q.options.map((opt, oi) => {
                        const chosenBy = results.filter(r => r.answers.find(a => a.qid === q.id && a.chosen === oi));
                        return (
                          <div key={oi} style={{ display: "flex", alignItems: "center", gap: 6, margin: "3px 0" }}>
                            <span style={{ fontSize: 11, color: oi === q.correct ? "#2ECC71" : "#5B7A9A", minWidth: 14 }}>{oi === q.correct ? "✓" : "·"}</span>
                            <span style={{ fontSize: 11, color: oi === q.correct ? "#2ECC71" : "#5B7A9A", flex: 1 }}>{opt}</span>
                            <span style={{ fontSize: 11, color: "#5B7A9A" }}>{chosenBy.length} étudiant{chosenBy.length > 1 ? "s" : ""}</span>
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

// ══════════════════════════════════════════════════
// STUDENT QCM
// ══════════════════════════════════════════════════
function StudentQCM({ studentName }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [showExp, setShowExp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const q = QUESTIONS[current];

  useEffect(() => {
    setSelected(null); setConfirmed(false); setShowExp(false); setTimer(0);
  }, [current]);

  useEffect(() => {
    if (confirmed || finished) return;
    const id = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [confirmed, finished, current]);

  const handleConfirm = () => {
    if (selected === null) return;
    const ans = { qid: q.id, chosen: selected, correct: selected === q.correct, time: timer };
    setConfirmed(true);
    setAnswers(prev => [...prev, ans]);
  };

  const handleNext = () => {
    if (current < QUESTIONS.length - 1) setCurrent(c => c + 1);
    else setFinished(true);
  };

  const handleSubmit = async () => {
    await saveResult(studentName, answers);
    setSubmitted(true);
  };

  const score = answers.filter(a => a.correct).length;
  const pct = finished ? Math.round((score / QUESTIONS.length) * 100) : 0;
  const niv = NIVEAU_STYLE[q?.niveau] || NIVEAU_STYLE[1];
  const progress = (current / QUESTIONS.length) * 100;

  if (finished) {
    return (
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#EAF4FB,#F4F9FD)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Trebuchet MS', sans-serif", padding: 24 }}>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 48px", maxWidth: 520, width: "100%", boxShadow: "0 8px 40px #1A6FA822", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪"}</div>
          <h2 style={{ fontSize: 28, color: "#0F4C81", margin: "0 0 6px" }}>{studentName}</h2>
          <p style={{ color: "#5B7A9A", marginBottom: 28, fontSize: 15 }}>TP1 — Premiers pas avec Python</p>

          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginBottom: 28 }}>
            <div style={{ background: "#E3F2FD", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: "#1A6FA8" }}>{score}/{QUESTIONS.length}</div>
              <div style={{ fontSize: 12, color: "#5B7A9A" }}>Bonnes réponses</div>
            </div>
            <div style={{ background: pct >= 80 ? "#E8F5E9" : pct >= 60 ? "#FFF3E0" : "#FDECEA", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 36, fontWeight: 800, color: pct >= 80 ? "#1E7E4C" : pct >= 60 ? "#B07A00" : "#C0392B" }}>{pct}%</div>
              <div style={{ fontSize: 12, color: "#5B7A9A" }}>Score</div>
            </div>
          </div>

          <div style={{ background: "#F8FBFE", borderRadius: 12, padding: "12px 16px", marginBottom: 24, textAlign: "left" }}>
            {QUESTIONS.map((qq, i) => {
              const ans = answers.find(a => a.qid === qq.id);
              return (
                <div key={qq.id} style={{ display: "flex", gap: 8, padding: "5px 0", borderBottom: i < QUESTIONS.length - 1 ? "1px solid #EEF4F8" : "none", alignItems: "center" }}>
                  <span style={{ fontSize: 14 }}>{ans?.correct ? "✅" : "❌"}</span>
                  <span style={{ flex: 1, fontSize: 12, color: "#1A2E40" }}>Q{i + 1} — {qq.theme}</span>
                  <span style={{ fontSize: 11, color: "#5B7A9A" }}>{ans?.time}s</span>
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <button onClick={handleSubmit}
              style={{ background: "#1A6FA8", color: "#fff", border: "none", borderRadius: 10, padding: "14px 36px", fontSize: 16, fontWeight: 700, cursor: "pointer", width: "100%" }}>
              📤 Envoyer mes résultats à l'enseignant
            </button>
          ) : (
            <div style={{ background: "#E8F5E9", border: "1px solid #2ECC71", borderRadius: 10, padding: 16, color: "#1E7E4C", fontWeight: 700 }}>
              ✅ Résultats envoyés ! L'enseignant peut voir votre score.
            </div>
          )}
        </div>
      </div>
    );
  }

  const isCorrect = confirmed && selected === q.correct;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#EAF4FB,#F4F9FD)", fontFamily: "'Trebuchet MS', sans-serif", padding: "20px 16px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, color: "#0F4C81", fontWeight: 800 }}>QCM TP1 — Python</h1>
            <p style={{ margin: 0, fontSize: 12, color: "#5B7A9A" }}>👤 {studentName}</p>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ background: "#E3F2FD", color: "#1A6FA8", borderRadius: 8, padding: "4px 12px", fontSize: 13, fontWeight: 700 }}>
              Q{current + 1}/{QUESTIONS.length}
            </span>
            <span style={{
              background: timer > 30 ? "#FDECEA" : "#F8FBFE",
              color: timer > 30 ? "#C0392B" : "#5B7A9A",
              border: `1px solid ${timer > 30 ? "#E74C3C" : "#DDE7F0"}`,
              borderRadius: 8, padding: "4px 10px", fontSize: 13, fontWeight: 700,
            }}>⏱ {timer}s</span>
            {answers.length > 0 && (
              <span style={{ background: "#E8F5E9", color: "#1E7E4C", borderRadius: 8, padding: "4px 10px", fontSize: 13, fontWeight: 700, border: "1px solid #2ECC71" }}>
                ✅ {score}/{answers.length}
              </span>
            )}
          </div>
        </div>

        {/* Progress */}
        <div style={{ background: "#DDE7F0", borderRadius: 8, height: 6, marginBottom: 18, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#1A6FA8,#00B4D8)", transition: "width 0.4s" }} />
        </div>

        {/* Badge niveau + thème */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <span style={{ background: niv.bg, color: niv.color, border: `1px solid ${niv.border}`, borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>{niv.label}</span>
          <span style={{ background: "#F8FBFE", color: "#5B7A9A", border: "1px solid #DDE7F0", borderRadius: 6, padding: "3px 10px", fontSize: 12 }}>{q.theme}</span>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 4px 24px #1A6FA812", padding: "24px 28px", marginBottom: 16 }}>
          <CodeBlock code={q.code} />
          <p style={{ fontSize: 17, fontWeight: 700, color: "#1A2E40", marginBottom: 18 }}>{q.question}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {q.options.map((opt, i) => {
              let bg = selected === i ? "#E3F2FD" : "#F8FBFE";
              let border = selected === i ? "2px solid #1A6FA8" : "2px solid #DDE7F0";
              let color = selected === i ? "#1A6FA8" : "#1A2E40";
              let badgeBg = selected === i ? "#1A6FA8" : "#DDE7F0";
              let badgeColor = selected === i ? "#fff" : "#5B7A9A";
              if (confirmed) {
                if (i === q.correct) { bg = "#E8F5E9"; border = "2px solid #2ECC71"; color = "#1E7E4C"; badgeBg = "#2ECC71"; badgeColor = "#fff"; }
                else if (i === selected) { bg = "#FDECEA"; border = "2px solid #E74C3C"; color = "#C0392B"; badgeBg = "#E74C3C"; badgeColor = "#fff"; }
                else { bg = "#F8FBFE"; border = "2px solid #DDE7F0"; color = "#AAA"; badgeBg = "#EEE"; badgeColor = "#AAA"; }
              }
              return (
                <button key={i} onClick={() => !confirmed && setSelected(i)} style={{
                  background: bg, border, borderRadius: 10, padding: "11px 14px",
                  textAlign: "left", cursor: confirmed ? "default" : "pointer",
                  display: "flex", alignItems: "center", gap: 10, transition: "all 0.2s",
                }}>
                  <span style={{ width: 24, height: 24, borderRadius: 6, background: badgeBg, color: badgeColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={{ fontFamily: "'Courier New', monospace", fontSize: 12.5, color, fontWeight: confirmed && i === q.correct ? 700 : 400 }}>
                    {opt}
                  </span>
                  {confirmed && i === q.correct && <span style={{ marginLeft: "auto" }}>✅</span>}
                  {confirmed && i === selected && i !== q.correct && <span style={{ marginLeft: "auto" }}>❌</span>}
                </button>
              );
            })}
          </div>

          {confirmed && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                background: isCorrect ? "#E8F5E9" : "#FDECEA",
                border: `1px solid ${isCorrect ? "#2ECC71" : "#E74C3C"}`,
                borderRadius: 10, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 8, marginBottom: 10,
              }}>
                <span style={{ fontSize: 20 }}>{isCorrect ? "🎉" : "😅"}</span>
                <span style={{ fontWeight: 700, color: isCorrect ? "#1E7E4C" : "#C0392B", fontSize: 14 }}>
                  {isCorrect ? "Bonne réponse !" : `Incorrect — Réponse : ${q.options[q.correct]}`}
                </span>
              </div>
              <button onClick={() => setShowExp(v => !v)} style={{ background: "none", border: "1px solid #1A6FA8", color: "#1A6FA8", borderRadius: 8, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>
                {showExp ? "▲ Masquer" : "▼ Explication"}
              </button>
              {showExp && (
                <div style={{ marginTop: 10, background: "#F8FBFE", border: "1px solid #DDE7F0", borderRadius: 10, padding: "12px 14px" }}>
                  {q.explication.split("\n").map((l, i) => (
                    <p key={i} style={{ margin: "3px 0", fontSize: 13, color: "#1A2E40", fontFamily: l.includes("→") || l.includes("=") ? "'Courier New'" : "inherit" }}>{l}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {!confirmed ? (
            <button onClick={handleConfirm} disabled={selected === null} style={{
              background: selected !== null ? "#1A6FA8" : "#DDE7F0",
              color: selected !== null ? "#fff" : "#5B7A9A",
              border: "none", borderRadius: 10, padding: "12px 28px",
              fontSize: 15, fontWeight: 700, cursor: selected !== null ? "pointer" : "default",
            }}>✔ Valider</button>
          ) : (
            <button onClick={handleNext} style={{ background: "#1A6FA8", color: "#fff", border: "none", borderRadius: 10, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
              {current < QUESTIONS.length - 1 ? "Question suivante →" : "Voir mes résultats 🏆"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// LOGIN / ACCUEIL
// ══════════════════════════════════════════════════
function LoginScreen({ onStudent, onTeacher }) {
  const [name, setName] = useState("");
  const [teacherMode, setTeacherMode] = useState(false);
  const [pwd, setPwd] = useState("");
  const TEACHER_PWD = "iset2025";

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0D1F2D 0%,#0F2A45 60%,#1A4A7A 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Trebuchet MS', sans-serif", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>🐍</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: "#F0A500", margin: "0 0 6px", letterSpacing: 1 }}>QCM TP1</h1>
          <p style={{ color: "#5B7A9A", fontSize: 15, margin: 0 }}>PCEP — Python Essentials 1 · ISET</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 12 }}>
            {[1, 2, 3].map(n => (
              <span key={n} style={{ background: NIVEAU_STYLE[n].border + "22", color: NIVEAU_STYLE[n].border, border: `1px solid ${NIVEAU_STYLE[n].border}`, borderRadius: 6, padding: "2px 10px", fontSize: 11, fontWeight: 700 }}>
                Niveau {n}
              </span>
            ))}
          </div>
        </div>

        {/* Card */}
        <div style={{ background: "#0F2A45", borderRadius: 20, padding: "32px 36px", boxShadow: "0 20px 60px #0008", border: "1px solid #1A4A7A" }}>
          {!teacherMode ? (
            <>
              <h2 style={{ margin: "0 0 6px", color: "#E8F4FB", fontSize: 18 }}>👤 Connexion étudiant</h2>
              <p style={{ color: "#5B7A9A", fontSize: 13, marginBottom: 24 }}>{QUESTIONS.length} questions · 3 niveaux de difficulté</p>

              <label style={{ display: "block", color: "#8AACBF", fontSize: 13, marginBottom: 8, fontWeight: 600 }}>Nom & Prénom</label>
              <input value={name} onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && name.trim().length >= 3 && onStudent(name.trim())}
                placeholder="ex : Ben Ali Mohamed"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: "2px solid #1A4A7A", background: "#0A1A2A", color: "#E8F4FB", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
              />
              <p style={{ color: "#3A6A8A", fontSize: 11, marginBottom: 20 }}>Minimum 3 caractères — votre nom apparaîtra dans le classement</p>

              <button onClick={() => onStudent(name.trim())} disabled={name.trim().length < 3}
                style={{ width: "100%", background: name.trim().length >= 3 ? "linear-gradient(90deg,#1A6FA8,#00B4D8)" : "#1A3A5A", color: name.trim().length >= 3 ? "#fff" : "#3A6A8A", border: "none", borderRadius: 10, padding: "14px", fontSize: 16, fontWeight: 800, cursor: name.trim().length >= 3 ? "pointer" : "default", transition: "all 0.2s" }}>
                🚀 Démarrer le QCM
              </button>

              <button onClick={() => setTeacherMode(true)} style={{ width: "100%", background: "none", color: "#3A6A8A", border: "1px solid #1A3A5A", borderRadius: 10, padding: "10px", fontSize: 13, cursor: "pointer", marginTop: 12 }}>
                🔐 Accès enseignant
              </button>
            </>
          ) : (
            <>
              <h2 style={{ margin: "0 0 6px", color: "#F0A500", fontSize: 18 }}>🔐 Accès enseignant</h2>
              <p style={{ color: "#5B7A9A", fontSize: 13, marginBottom: 20 }}>Tableau de bord avec résultats en temps réel</p>

              <label style={{ display: "block", color: "#8AACBF", fontSize: 13, marginBottom: 8, fontWeight: 600 }}>Mot de passe</label>
              <input type="password" value={pwd} onChange={e => setPwd(e.target.value)}
                onKeyDown={e => e.key === "Enter" && pwd === TEACHER_PWD && onTeacher()}
                placeholder="••••••••"
                style={{ width: "100%", padding: "12px 14px", borderRadius: 10, border: `2px solid ${pwd.length > 0 && pwd !== TEACHER_PWD ? "#E74C3C" : "#1A4A7A"}`, background: "#0A1A2A", color: "#E8F4FB", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }}
              />
              {pwd.length > 0 && pwd !== TEACHER_PWD && (
                <p style={{ color: "#E74C3C", fontSize: 12, marginBottom: 8 }}>Mot de passe incorrect</p>
              )}
              <p style={{ color: "#3A6A8A", fontSize: 11, marginBottom: 20 }}>Indice : iset + année</p>

              <button onClick={() => pwd === TEACHER_PWD && onTeacher()} disabled={pwd !== TEACHER_PWD}
                style={{ width: "100%", background: pwd === TEACHER_PWD ? "linear-gradient(90deg,#F0A500,#E67E22)" : "#1A3A5A", color: pwd === TEACHER_PWD ? "#0F2A45" : "#3A6A8A", border: "none", borderRadius: 10, padding: "14px", fontSize: 16, fontWeight: 800, cursor: pwd === TEACHER_PWD ? "pointer" : "default" }}>
                📊 Ouvrir le tableau de bord
              </button>
              <button onClick={() => { setTeacherMode(false); setPwd(""); }} style={{ width: "100%", background: "none", color: "#3A6A8A", border: "1px solid #1A3A5A", borderRadius: 10, padding: "10px", fontSize: 13, cursor: "pointer", marginTop: 10 }}>
                ← Retour
              </button>
            </>
          )}
        </div>
        <p style={{ textAlign: "center", color: "#2A4A6A", fontSize: 11, marginTop: 16 }}>Les résultats sont partagés en temps réel avec l'enseignant</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════
// APP ROOT
// ══════════════════════════════════════════════════
export default function App() {
  const [mode, setMode] = useState("login"); // login | student | teacher
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
