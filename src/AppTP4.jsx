// ─────────────────────────────────────────────────────────────────────────────
//  QCM TP4 — Boucles · Listes · Opérations logiques & bit à bit
//  PCEP Module 3 Section 2  |  ISET Béja  |  60s strict par question
//  Firebase Realtime Database  ·  GitHub Pages
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, set, remove, onValue } from "firebase/database";

// ═══════════════════════════════════════════════════════════════════════════
// QUESTIONS — 10 questions PCEP Module 3 Section 2
// ═══════════════════════════════════════════════════════════════════════════
const QUESTIONS = [
  // ── Niveau 1 : for & range() ─────────────────────────────────────────────
  {
    id: 1, niveau: 1, theme: "range() — valeurs générées",
    code: `for i in range(1, 6):
    print(i, end=" ")`,
    question: "Quelle est la sortie exacte ?",
    options: ["0 1 2 3 4 5", "1 2 3 4 5", "1 2 3 4 5 6", "0 1 2 3 4"],
    correct: 1,
    explication: [
      "range(1, 6) génère : 1, 2, 3, 4, 5",
      "start = 1 inclus  ·  stop = 6 EXCLU",
      "end=\" \" affiche les valeurs séparées par un espace sur une ligne.",
      "→ Sortie : 1 2 3 4 5",
    ],
  },
  {
    id: 2, niveau: 1, theme: "range() avec pas",
    code: `total = 0
for i in range(0, 11, 2):
    total += i
print(total)`,
    question: "Quelle est la sortie ?",
    options: ["25", "30", "55", "36"],
    correct: 1,
    explication: [
      "range(0, 11, 2) génère : 0, 2, 4, 6, 8, 10",
      "total = 0+2+4+6+8+10 = 30",
      "step=2 → uniquement les nombres pairs de 0 à 10.",
      "→ Sortie : 30",
    ],
  },
  {
    id: 3, niveau: 1, theme: "while & break",
    code: `n = 0
while n < 10:
    n += 1
    if n == 5:
        break
print(n)`,
    question: "Quelle est la sortie ?",
    options: ["4", "5", "10", "0"],
    correct: 1,
    explication: [
      "La boucle incrémente n à chaque tour.",
      "Quand n == 5, break est exécuté → sortie immédiate de la boucle.",
      "n vaut 5 au moment du break.",
      "→ Sortie : 5",
    ],
  },
  // ── Niveau 2 : Listes ────────────────────────────────────────────────────
  {
    id: 4, niveau: 2, theme: "Listes — opérateur in",
    code: `liste = [10, 23, 45, 67, 89, 12, 34]
n = 45
if n in liste:
    print("Trouvé à l'indice", liste.index(n))
else:
    print("Absent")`,
    question: "Quelle est la sortie ?",
    options: [
      "Absent",
      "Trouvé à l'indice 2",
      "Trouvé à l'indice 3",
      "Trouvé à l'indice 45",
    ],
    correct: 1,
    explication: [
      "45 in liste → True (45 est bien dans la liste).",
      "liste.index(45) retourne l'indice de la première occurrence.",
      "liste = [10, 23, 45, ...] → indice 0=10, 1=23, 2=45",
      "→ Sortie : Trouvé à l'indice 2",
    ],
  },
  {
    id: 5, niveau: 2, theme: "Listes — méthodes sort/min/max",
    code: `nums = [5, 2, 8, 1, 9, 3]
nums.sort()
print(nums[0], nums[-1], sum(nums))`,
    question: "Quelle est la sortie ?",
    options: ["5 3 28", "1 9 28", "1 9 24", "2 8 28"],
    correct: 1,
    explication: [
      "nums.sort() trie en place → [1, 2, 3, 5, 8, 9]",
      "nums[0]  = 1  (premier après tri = minimum)",
      "nums[-1] = 9  (dernier après tri = maximum)",
      "sum([1,2,3,5,8,9]) = 28",
      "→ Sortie : 1 9 28",
    ],
  },
  {
    id: 6, niveau: 2, theme: "Listes — slicing",
    code: `lst = [10, 20, 30, 40, 50]
print(lst[1:4])
print(lst[::-1])`,
    question: "Quelles sont les deux sorties (dans l'ordre) ?",
    options: [
      "[20, 30, 40] et [50, 40, 30, 20, 10]",
      "[10, 20, 30] et [50, 40, 30, 20, 10]",
      "[20, 30, 40] et [10, 20, 30, 40, 50]",
      "[20, 30, 40, 50] et [50, 40, 30, 20, 10]",
    ],
    correct: 0,
    explication: [
      "lst[1:4] → indices 1, 2, 3 → [20, 30, 40]  (stop=4 exclu)",
      "lst[::-1] → step=-1 → liste inversée → [50, 40, 30, 20, 10]",
      "Le slicing [::-1] est l'équivalent de reverse() sans modifier la liste.",
    ],
  },
  {
    id: 7, niveau: 2, theme: "continue dans for",
    code: `resultat = []
for i in range(1, 8):
    if i % 2 == 0:
        continue
    resultat.append(i)
print(resultat)`,
    question: "Quelle est la sortie ?",
    options: [
      "[2, 4, 6]",
      "[1, 3, 5, 7]",
      "[1, 2, 3, 4, 5, 6, 7]",
      "[2, 4, 6, 8]",
    ],
    correct: 1,
    explication: [
      "continue saute l'itération courante si i est pair.",
      "Seuls les impairs passent : 1, 3, 5, 7",
      "range(1, 8) → 1, 2, 3, 4, 5, 6, 7  (8 exclu)",
      "→ Sortie : [1, 3, 5, 7]",
    ],
  },
  // ── Niveau 3 : Opérations logiques & bit à bit ───────────────────────────
  {
    id: 8, niveau: 3, theme: "Opérateurs bit à bit — &",
    code: `a = 0b1010   # 10 en décimal
b = 0b1100   # 12 en décimal
print(a & b)`,
    question: "Quelle est la sortie ?",
    options: ["22", "14", "8", "6"],
    correct: 2,
    explication: [
      "& = ET bit à bit : 1 seulement si les DEUX bits sont à 1.",
      "  1010",
      "& 1100",
      "= 1000  →  8 en décimal",
      "→ Sortie : 8",
    ],
  },
  {
    id: 9, niveau: 3, theme: "Décalage bit à bit << >>",
    code: `x = 8
print(x << 1)
print(x >> 2)`,
    question: "Quelles sont les deux sorties (dans l'ordre) ?",
    options: ["16 et 2", "16 et 4", "4 et 2", "4 et 32"],
    correct: 0,
    explication: [
      "x << 1 : décalage gauche de 1 bit = multiplication par 2",
      "8 << 1 = 16",
      "x >> 2 : décalage droite de 2 bits = division par 4",
      "8 >> 2 = 2",
      "→ Sortie : 16 puis 2",
    ],
  },
  {
    id: 10, niveau: 3, theme: "Synthèse — while + liste",
    code: `nombres = []
i = 1
while i <= 5:
    nombres.append(i ** 2)
    i += 1
print(nombres)`,
    question: "Quelle est la sortie ?",
    options: [
      "[1, 2, 3, 4, 5]",
      "[1, 4, 9, 16, 25]",
      "[2, 4, 6, 8, 10]",
      "[1, 4, 9, 16, 25, 36]",
    ],
    correct: 1,
    explication: [
      "La boucle while ajoute i² dans la liste pour i = 1..5.",
      "1²=1  2²=4  3²=9  4²=16  5²=25",
      "append() ajoute chaque valeur à la fin de la liste.",
      "→ Sortie : [1, 4, 9, 16, 25]",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════
const TEACHER_PWD = "iset2025";
const DB_KEY      = "qcm_tp4";
const TIME_LIMIT  = 60;

const NIV = {
  1: { bg:"#E8F5E9", border:"#27AE60", color:"#1E7E4C", label:"Niveau 1 — Boucles & range()" },
  2: { bg:"#E3F2FD", border:"#2E86C1", color:"#1A5276", label:"Niveau 2 — Listes"            },
  3: { bg:"#FFF3E0", border:"#E67E22", color:"#B07A00", label:"Niveau 3 — Opérations bit à bit" },
};

// ═══════════════════════════════════════════════════════════════════════════
// FIREBASE
// ═══════════════════════════════════════════════════════════════════════════
async function saveResult(name, answers) {
  const key = name.trim().replace(/\s+/g,"_").replace(/[.#$[\]]/g,"");
  await set(ref(db, `${DB_KEY}/${key}`), {
    name, answers,
    score: answers.filter(a => a.correct).length,
    total: answers.length,
    timedOutCount: answers.filter(a => a.timedOut).length,
    submittedAt: new Date().toISOString(),
  });
}
async function clearAll() { await remove(ref(db, DB_KEY)); }

// ═══════════════════════════════════════════════════════════════════════════
// Bloc code Python colorisé
// ═══════════════════════════════════════════════════════════════════════════
function CodeBlock({ code }) {
  return (
    <div style={{
      background:"#0D1F2D", borderRadius:10, padding:"12px 16px",
      fontFamily:"'Courier New',monospace", fontSize:12.5, lineHeight:1.9,
      border:"1px solid #1A4A7A", marginBottom:16, overflowX:"auto",
    }}>
      {code.split("\n").map((line, i) => {
        const isComment = line.trim().startsWith("#");
        const parts = [];
        if (isComment) {
          parts.push(<span key="c" style={{ color:"#4A8AA8", fontStyle:"italic" }}>{line}</span>);
        } else {
          const strRe = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
          let last = 0, m;
          while ((m = strRe.exec(line)) !== null) {
            if (m.index > last)
              parts.push(<span key={last} style={{ color:"#E8F4FB" }}>{line.slice(last, m.index)}</span>);
            parts.push(<span key={m.index} style={{ color:"#F0A500" }}>{m[0]}</span>);
            last = m.index + m[0].length;
          }
          if (last < line.length)
            parts.push(<span key={last} style={{ color:"#E8F4FB" }}>{line.slice(last)}</span>);
        }
        return (
          <div key={i} style={{ display:"flex", gap:10 }}>
            <span style={{ color:"#2A5A7A", minWidth:16, fontSize:10, userSelect:"none", paddingTop:2 }}>{i+1}</span>
            <span>{parts}</span>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tableau de bord enseignant
// ═══════════════════════════════════════════════════════════════════════════
function TeacherDashboard({ onBack }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selQ,    setSelQ   ] = useState(null);

  useEffect(() => {
    const unsub = onValue(ref(db, DB_KEY), snap => {
      const data = snap.exists() ? Object.values(snap.val()) : [];
      data.sort((a, b) => b.score - a.score);
      setResults(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const total    = results.length;
  const avgScore = total ? (results.reduce((s,r)=>s+r.score,0)/total).toFixed(1) : 0;
  const avgPct   = total ? Math.round(results.reduce((s,r)=>s+r.score/r.total,0)/total*100) : 0;
  const finished = results.filter(r=>r.total===QUESTIONS.length).length;
  const avgTO    = total ? (results.reduce((s,r)=>s+(r.timedOutCount||0),0)/total).toFixed(1) : 0;

  const qStats = QUESTIONS.map(q => {
    const ans = results.filter(r=>r.answers?.find(a=>a.qid===q.id));
    const ok  = results.filter(r=>r.answers?.find(a=>a.qid===q.id&&a.correct));
    return { q, answered:ans.length, correct:ok.length,
             pct: ans.length ? Math.round(ok.length/ans.length*100) : null };
  });

  const F = "'Trebuchet MS',sans-serif";
  return (
    <div style={{ minHeight:"100vh", background:"#0D1F2D", fontFamily:F, color:"#E8F4FB" }}>
      <div style={{ background:"#0F2A45", borderBottom:"3px solid #1ABC9C", padding:"14px 22px",
                    display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ margin:0, fontSize:19, fontWeight:800, color:"#1ABC9C" }}>
            📊 Tableau de bord — TP4 Module 3 Section 2
          </h1>
          <p style={{ margin:0, fontSize:11, color:"#5B7A9A" }}>
            Boucles · Listes · Opérations bit à bit · Temps réel Firebase
          </p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={async()=>{ if(window.confirm("Effacer tous les résultats ?")) await clearAll(); }}
            style={{ background:"#C0392B", color:"#fff", border:"none", borderRadius:7,
                     padding:"7px 14px", cursor:"pointer", fontWeight:700, fontSize:12 }}>
            🗑 Réinitialiser
          </button>
          <button onClick={onBack}
            style={{ background:"#1A3A5A", color:"#5B7A9A", border:"none",
                     borderRadius:7, padding:"7px 14px", cursor:"pointer", fontSize:12 }}>
            ← Retour
          </button>
        </div>
      </div>

      <div style={{ padding:"18px 22px" }}>
        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(148px,1fr))", gap:12, marginBottom:20 }}>
          {[
            { label:"Étudiants",    value:total,       sub:"connectés",      color:"#00B4D8", icon:"👥" },
            { label:"Score moyen",  value:`${avgScore}/${QUESTIONS.length}`, sub:"bonnes rép.", color:"#2ECC71", icon:"📈" },
            { label:"Réussite",     value:avgPct+"%",  sub:"moyenne",        color:"#1ABC9C", icon:"🎯" },
            { label:"Terminé",      value:finished,    sub:"étudiants",      color:"#9B59B6", icon:"✅" },
            { label:"Temps écoulés",value:avgTO,       sub:"moy/étudiant",   color:"#E74C3C", icon:"⏰" },
          ].map((k,i) => (
            <div key={i} style={{ background:"#0F2A45", borderRadius:11, padding:"14px 16px",
                                  border:`1px solid ${k.color}33` }}>
              <div style={{ fontSize:20 }}>{k.icon}</div>
              <div style={{ fontSize:24, fontWeight:800, color:k.color }}>{loading?"…":k.value}</div>
              <div style={{ fontSize:11, color:"#5B7A9A" }}>{k.label}</div>
              <div style={{ fontSize:10, color:k.color }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Classement */}
          <div style={{ background:"#0F2A45", borderRadius:11, padding:16, border:"1px solid #1A4A7A" }}>
            <h3 style={{ margin:"0 0 12px", color:"#1ABC9C", fontSize:14 }}>🏆 Classement en direct</h3>
            {loading ? <p style={{ color:"#5B7A9A" }}>Connexion Firebase…</p>
              : results.length===0
              ? <p style={{ color:"#5B7A9A", fontSize:12 }}>En attente des résultats…</p>
              : (
              <div style={{ maxHeight:300, overflowY:"auto" }}>
                {results.map((r, i) => {
                  const pct = Math.round(r.score/r.total*100);
                  const medal = i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`;
                  return (
                    <div key={r.name} style={{ display:"flex", alignItems:"center", gap:7,
                                               padding:"6px 0", borderBottom:"1px solid #1A3A5A" }}>
                      <span style={{ fontSize:13, minWidth:24 }}>{medal}</span>
                      <span style={{ flex:1, fontSize:12, fontWeight:i<3?700:400,
                                     color:i<3?"#E8F4FB":"#8AACBF" }}>{r.name}</span>
                      {(r.timedOutCount||0)>0 &&
                        <span style={{ fontSize:10, color:"#E74C3C" }}>⏰×{r.timedOutCount}</span>}
                      <span style={{ fontSize:12, fontWeight:700,
                                     color:pct>=70?"#2ECC71":pct>=50?"#1ABC9C":"#E74C3C" }}>
                        {r.score}/{r.total}
                      </span>
                      <div style={{ width:52 }}>
                        <div style={{ background:"#1A3A5A", borderRadius:3, height:5, overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%",
                                        background:pct>=70?"#2ECC71":pct>=50?"#1ABC9C":"#E74C3C",
                                        transition:"width 0.5s" }}/>
                        </div>
                        <div style={{ fontSize:9, color:"#5B7A9A", textAlign:"right", marginTop:1 }}>{pct}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats par question */}
          <div style={{ background:"#0F2A45", borderRadius:11, padding:16, border:"1px solid #1A4A7A" }}>
            <h3 style={{ margin:"0 0 12px", color:"#00B4D8", fontSize:14 }}>📋 Résultats par question</h3>
            <div style={{ maxHeight:300, overflowY:"auto" }}>
              {qStats.map(({ q, answered, pct }) => (
                <div key={q.id} onClick={()=>setSelQ(selQ?.id===q.id?null:q)}
                  style={{ padding:"6px 0", borderBottom:"1px solid #1A3A5A", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                    <span style={{ background:NIV[q.niveau].border+"33", color:NIV[q.niveau].border,
                                   borderRadius:3, padding:"1px 5px", fontSize:9, fontWeight:700 }}>
                      N{q.niveau}
                    </span>
                    <span style={{ flex:1, fontSize:11, color:"#8AACBF" }}>Q{q.id} — {q.theme}</span>
                    <span style={{ fontSize:10, color:"#5B7A9A" }}>{answered}</span>
                    {pct!==null &&
                      <span style={{ fontSize:11, fontWeight:700,
                                     color:pct>=70?"#2ECC71":pct>=50?"#1ABC9C":"#E74C3C" }}>
                        {pct}%
                      </span>}
                  </div>
                  {pct!==null && (
                    <div style={{ background:"#1A3A5A", borderRadius:3, height:4, overflow:"hidden" }}>
                      <div style={{ width:`${pct}%`, height:"100%",
                                    background:pct>=70?"#2ECC71":pct>=50?"#1ABC9C":"#E74C3C",
                                    transition:"width 0.5s" }}/>
                    </div>
                  )}
                  {selQ?.id===q.id && (
                    <div style={{ marginTop:7, background:"#0A1A2A", borderRadius:7, padding:9 }}>
                      <p style={{ margin:"0 0 5px", fontSize:10, color:"#1ABC9C", fontWeight:700 }}>
                        {q.question}
                      </p>
                      {q.options.map((opt, oi) => {
                        const n = results.filter(r=>r.answers?.find(a=>a.qid===q.id&&a.chosen===oi)).length;
                        return (
                          <div key={oi} style={{ display:"flex", gap:5, margin:"2px 0" }}>
                            <span style={{ fontSize:10, color:oi===q.correct?"#2ECC71":"#5B7A9A", minWidth:12 }}>
                              {oi===q.correct?"✓":"·"}
                            </span>
                            <span style={{ fontSize:10, color:oi===q.correct?"#2ECC71":"#5B7A9A", flex:1 }}>
                              {opt}
                            </span>
                            <span style={{ fontSize:10, color:"#5B7A9A" }}>{n}</span>
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
// QCM Étudiant
// ═══════════════════════════════════════════════════════════════════════════
function StudentQCM({ studentName }) {
  const [current,    setCurrent   ] = useState(0);
  const [selected,   setSelected  ] = useState(null);
  const [confirmed,  setConfirmed ] = useState(false);
  const [answers,    setAnswers   ] = useState([]);
  const [finished,   setFinished  ] = useState(false);
  const [showExp,    setShowExp   ] = useState(false);
  const [timer,      setTimer     ] = useState(TIME_LIMIT);
  const [timedOut,   setTimedOut  ] = useState(false);
  const [submitted,  setSubmitted ] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const q   = QUESTIONS[current];
  const niv = NIV[q?.niveau] || NIV[1];

  useEffect(() => {
    setSelected(null); setConfirmed(false); setShowExp(false);
    setTimer(TIME_LIMIT); setTimedOut(false);
  }, [current]);

  useEffect(() => {
    if (confirmed || finished) return;
    if (timer <= 0) {
      setTimedOut(true);
      setConfirmed(true);
      setAnswers(prev => [...prev, {
        qid:q.id, chosen:null, correct:false, time:TIME_LIMIT, timedOut:true
      }]);
      return;
    }
    const id = setInterval(() => setTimer(t => t-1), 1000);
    return () => clearInterval(id);
  }, [timer, confirmed, finished, current]);

  const handleConfirm = () => {
    if (selected===null) return;
    setConfirmed(true);
    setAnswers(prev => [...prev, {
      qid:q.id, chosen:selected, correct:selected===q.correct,
      time:TIME_LIMIT-timer, timedOut:false
    }]);
  };

  const handleNext = () => {
    if (current < QUESTIONS.length-1) setCurrent(c => c+1);
    else setFinished(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await saveResult(studentName, answers); setSubmitted(true); }
    catch { alert("Erreur d'envoi. Vérifiez votre connexion."); }
    finally { setSubmitting(false); }
  };

  const score     = answers.filter(a => a.correct).length;
  const pct       = finished ? Math.round(score/QUESTIONS.length*100) : 0;
  const progress  = current/QUESTIONS.length*100;
  const isCorrect = confirmed && selected===q.correct;

  // Chrono couleurs
  const tColor  = timer<=10?"#C0392B":timer<=20?"#E67E22":"#5B7A9A";
  const tBg     = timer<=10?"#FDECEA":timer<=20?"#FFF3E0":"#F8FBFE";
  const tBorder = timer<=10?"#E74C3C":timer<=20?"#E67E22":"#DDE7F0";
  const barCol  = timer<=10?"#E74C3C":timer<=20?"#E67E22":"#1ABC9C";

  const F = "'Trebuchet MS',sans-serif";

  // ── Écran résultats ─────────────────────────────────────
  if (finished) {
    const toCount = answers.filter(a => a.timedOut).length;
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#EAF4FB,#F4F9FD)",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    fontFamily:F, padding:20 }}>
        <div style={{ background:"#fff", borderRadius:18, padding:"32px 40px", maxWidth:500,
                      width:"100%", boxShadow:"0 8px 40px #1A527618", textAlign:"center" }}>
          <div style={{ fontSize:54, marginBottom:8 }}>
            {pct>=80?"🏆":pct>=60?"👍":"💪"}
          </div>
          <h2 style={{ fontSize:24, color:"#1A5276", margin:"0 0 4px" }}>{studentName}</h2>
          <p style={{ color:"#5B7A9A", marginBottom:20, fontSize:13 }}>
            TP4 — Boucles · Listes · Opérations bit à bit
          </p>

          <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:18, flexWrap:"wrap" }}>
            {[
              { val:`${score}/${QUESTIONS.length}`, label:"Réponses",     bg:"#E3F2FD", col:"#1A5276" },
              { val:`${pct}%`,                      label:"Score",        bg:pct>=80?"#E8F5E9":pct>=60?"#FFF3E0":"#FDECEA", col:pct>=80?"#1E7E4C":pct>=60?"#B07A00":"#C0392B" },
              { val:`${toCount}`,                   label:"Temps écoulés",bg:toCount>0?"#FDECEA":"#E8F5E9", col:toCount>0?"#C0392B":"#1E7E4C" },
            ].map((k,i) => (
              <div key={i} style={{ background:k.bg, borderRadius:9, padding:"12px 16px", minWidth:88 }}>
                <div style={{ fontSize:26, fontWeight:800, color:k.col }}>{k.val}</div>
                <div style={{ fontSize:10, color:"#5B7A9A" }}>{k.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background:"#F8FBFE", borderRadius:9, padding:"9px 12px",
                        marginBottom:18, textAlign:"left" }}>
            {QUESTIONS.map((qq, i) => {
              const ans = answers.find(a => a.qid===qq.id);
              return (
                <div key={qq.id} style={{ display:"flex", gap:6, padding:"3px 0",
                                          borderBottom:i<QUESTIONS.length-1?"1px solid #EEF4F8":"none",
                                          alignItems:"center" }}>
                  <span style={{ fontSize:12 }}>
                    {ans?.timedOut?"⏰":ans?.correct?"✅":"❌"}
                  </span>
                  <span style={{ flex:1, fontSize:11, color:"#1A2E40" }}>Q{i+1} — {qq.theme}</span>
                  <span style={{ fontSize:10, color:ans?.timedOut?"#E67E22":"#5B7A9A",
                                 fontWeight:ans?.timedOut?700:400 }}>
                    {ans?.timedOut?"Temps !":ans?.time!=null?`${ans.time}s`:"—"}
                  </span>
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <button onClick={handleSubmit} disabled={submitting}
              style={{ background:submitting?"#AAA":"#1A5276", color:"#fff", border:"none",
                       borderRadius:9, padding:"12px 30px", fontSize:14, fontWeight:700,
                       cursor:submitting?"default":"pointer", width:"100%" }}>
              {submitting?"⏳ Envoi…":"📤 Envoyer à l'enseignant"}
            </button>
          ) : (
            <div style={{ background:"#E8F5E9", border:"1px solid #2ECC71", borderRadius:9,
                          padding:12, color:"#1E7E4C", fontWeight:700 }}>
              ✅ Résultats envoyés avec succès !
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Écran question ───────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#EAF4FB,#F4F9FD)",
                  fontFamily:F, padding:"16px 12px" }}>
      <div style={{ maxWidth:700, margin:"0 auto" }}>

        <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.06)}}`}</style>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center",
                      marginBottom:10, flexWrap:"wrap", gap:6 }}>
          <div>
            <h1 style={{ margin:0, fontSize:15, color:"#1A5276", fontWeight:800 }}>
              QCM TP4 — Module 3 Section 2
            </h1>
            <p style={{ margin:0, fontSize:11, color:"#5B7A9A" }}>👤 {studentName}</p>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ background:"#E3F2FD", color:"#1A5276", borderRadius:6,
                           padding:"3px 10px", fontSize:12, fontWeight:700 }}>
              Q{current+1}/{QUESTIONS.length}
            </span>
            {/* Chrono 60s strict */}
            <span style={{
              background:tBg, color:tColor, border:`2px solid ${tBorder}`,
              borderRadius:6, padding:"3px 10px", fontSize:13, fontWeight:800,
              minWidth:50, textAlign:"center",
              animation:timer<=10&&!confirmed?"pulse 1s infinite":"none",
            }}>
              {confirmed?"⏹":timedOut?"⏰ 0s":`⏱ ${timer}s`}
            </span>
            {answers.length>0 && (
              <span style={{ background:"#E8F5E9", color:"#1E7E4C", borderRadius:6,
                             padding:"3px 9px", fontSize:11, fontWeight:700,
                             border:"1px solid #2ECC71" }}>
                ✅ {score}/{answers.length}
              </span>
            )}
          </div>
        </div>

        {/* Barre compte à rebours */}
        {!confirmed && (
          <div style={{ background:"#DDE7F0", borderRadius:6, height:7, marginBottom:6, overflow:"hidden" }}>
            <div style={{
              height:"100%", width:`${timer/TIME_LIMIT*100}%`,
              background:barCol, transition:"width 1s linear, background 0.3s",
            }}/>
          </div>
        )}

        {/* Barre progression globale */}
        <div style={{ background:"#EEF4F8", borderRadius:6, height:4, marginBottom:14, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${progress}%`, background:"#1ABC9C", transition:"width 0.4s" }}/>
        </div>

        {/* Badges */}
        <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
          <span style={{ background:niv.bg, color:niv.color, border:`1px solid ${niv.border}`,
                         borderRadius:5, padding:"2px 9px", fontSize:11, fontWeight:700 }}>
            {niv.label}
          </span>
          <span style={{ background:"#F8FBFE", color:"#5B7A9A", border:"1px solid #DDE7F0",
                         borderRadius:5, padding:"2px 9px", fontSize:11 }}>
            {q.theme}
          </span>
        </div>

        {/* Card question */}
        <div style={{ background:"#fff", borderRadius:13, boxShadow:"0 4px 20px #1A527610",
                      padding:"20px 22px", marginBottom:12 }}>
          <CodeBlock code={q.code}/>
          <p style={{ fontSize:15, fontWeight:700, color:"#1A2E40", marginBottom:14 }}>{q.question}</p>

          {/* Options */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {q.options.map((opt, i) => {
              let bg     = selected===i?"#E3F2FD":"#F8FBFE";
              let border = selected===i?"2px solid #1A5276":"2px solid #DDE7F0";
              let color  = selected===i?"#1A5276":"#1A2E40";
              let bbg    = selected===i?"#1A5276":"#DDE7F0";
              let bcol   = selected===i?"#fff":"#5B7A9A";
              if (confirmed) {
                if (i===q.correct)
                  { bg="#E8F5E9"; border="2px solid #27AE60"; color="#1E7E4C"; bbg="#27AE60"; bcol="#fff"; }
                else if (i===selected)
                  { bg="#FDECEA"; border="2px solid #E74C3C"; color="#C0392B"; bbg="#E74C3C"; bcol="#fff"; }
                else
                  { bg="#F8FBFE"; border="2px solid #DDE7F0"; color="#AAA"; bbg="#EEE"; bcol="#AAA"; }
              }
              return (
                <button key={i} onClick={()=>!confirmed&&setSelected(i)}
                  style={{ background:bg, border, borderRadius:8, padding:"10px 11px",
                           textAlign:"left", cursor:confirmed?"default":"pointer",
                           display:"flex", alignItems:"center", gap:8, transition:"all 0.18s" }}>
                  <span style={{ width:22, height:22, borderRadius:5, background:bbg, color:bcol,
                                 display:"flex", alignItems:"center", justifyContent:"center",
                                 fontSize:11, fontWeight:800, flexShrink:0 }}>
                    {String.fromCharCode(65+i)}
                  </span>
                  <span style={{ fontFamily:"'Courier New',monospace", fontSize:11.5, color,
                                 fontWeight:confirmed&&i===q.correct?700:400, wordBreak:"break-all" }}>
                    {opt}
                  </span>
                  {confirmed&&i===q.correct && <span style={{ marginLeft:"auto" }}>✅</span>}
                  {confirmed&&i===selected&&i!==q.correct && <span style={{ marginLeft:"auto" }}>❌</span>}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {confirmed && (
            <div style={{ marginTop:12 }}>
              <div style={{
                background:timedOut?"#FFF3E0":isCorrect?"#E8F5E9":"#FDECEA",
                border:`1px solid ${timedOut?"#E67E22":isCorrect?"#27AE60":"#E74C3C"}`,
                borderRadius:8, padding:"8px 11px", display:"flex",
                alignItems:"flex-start", gap:7, marginBottom:8,
              }}>
                <span style={{ fontSize:17, flexShrink:0 }}>
                  {timedOut?"⏰":isCorrect?"🎉":"😅"}
                </span>
                <div>
                  <div style={{ fontWeight:700,
                                color:timedOut?"#E67E22":isCorrect?"#1E7E4C":"#C0392B",
                                fontSize:13 }}>
                    {timedOut
                      ? "Temps écoulé ! Passage automatique."
                      : isCorrect
                      ? "Bonne réponse !"
                      : "Incorrect"}
                  </div>
                  {(timedOut||!isCorrect) && (
                    <div style={{ fontSize:11, color:"#666", marginTop:2 }}>
                      Réponse correcte :{" "}
                      <strong style={{ fontFamily:"Courier New" }}>{q.options[q.correct]}</strong>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={()=>setShowExp(v=>!v)}
                style={{ background:"none", border:"1px solid #1A5276", color:"#1A5276",
                         borderRadius:6, padding:"4px 10px", fontSize:11,
                         cursor:"pointer", fontWeight:600 }}>
                {showExp?"▲ Masquer":"▼ Explication PCEP"}
              </button>
              {showExp && (
                <div style={{ marginTop:8, background:"#F8FBFE", border:"1px solid #DDE7F0",
                              borderRadius:8, padding:"10px 12px" }}>
                  {q.explication.map((l, i) => (
                    <p key={i} style={{ margin:"2px 0", fontSize:11.5, color:"#1A2E40",
                      fontFamily: l.startsWith("→")||l.includes("=")||l.includes("range")||
                                  l.includes("0b")||l.includes("<<")||l.includes(">>")||
                                  l.includes("append")||l.includes("sort")
                                  ? "'Courier New'" : "inherit" }}>
                      {l}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div style={{ display:"flex", justifyContent:"flex-end" }}>
          {!confirmed ? (
            <button onClick={handleConfirm} disabled={selected===null}
              style={{ background:selected!==null?"#1A5276":"#DDE7F0",
                       color:selected!==null?"#fff":"#5B7A9A",
                       border:"none", borderRadius:8, padding:"11px 24px",
                       fontSize:14, fontWeight:700,
                       cursor:selected!==null?"pointer":"default" }}>
              ✔ Valider
            </button>
          ) : (
            <button onClick={handleNext}
              style={{ background:"#1A5276", color:"#fff", border:"none",
                       borderRadius:8, padding:"11px 24px", fontSize:14,
                       fontWeight:700, cursor:"pointer" }}>
              {current<QUESTIONS.length-1?"Question suivante →":"Voir mes résultats 🏆"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Écran de connexion
// ═══════════════════════════════════════════════════════════════════════════
function LoginScreen({ onStudent, onTeacher }) {
  const [name,  setName ] = useState("");
  const [tMode, setTMode] = useState(false);
  const [pwd,   setPwd  ] = useState("");
  const [pwdErr,setPwdErr] = useState(false);
  const F = "'Trebuchet MS',sans-serif";

  return (
    <div style={{ minHeight:"100vh",
                  background:"linear-gradient(135deg,#0D1F2D 0%,#0F2A45 60%,#1A4A7A 100%)",
                  display:"flex", alignItems:"center", justifyContent:"center",
                  fontFamily:F, padding:20 }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:46, marginBottom:6 }}>🐍</div>
          <h1 style={{ fontSize:26, fontWeight:900, color:"#1ABC9C", margin:"0 0 4px" }}>QCM TP4</h1>
          <p style={{ color:"#5B7A9A", fontSize:13, margin:"0 0 8px" }}>
            PCEP — Module 3 Section 2 · Boucles & Listes
          </p>
          <div style={{ display:"flex", justifyContent:"center", gap:5, flexWrap:"wrap" }}>
            {[1,2,3].map(n => (
              <span key={n} style={{ background:NIV[n].border+"22", color:NIV[n].border,
                                     border:`1px solid ${NIV[n].border}`, borderRadius:4,
                                     padding:"2px 8px", fontSize:10, fontWeight:700 }}>N{n}</span>
            ))}
            <span style={{ background:"#1A4A7A", color:"#AED6F1", borderRadius:4,
                           padding:"2px 8px", fontSize:10, fontWeight:700 }}>
              {QUESTIONS.length} questions · 60s/Q
            </span>
          </div>
        </div>

        <div style={{ background:"#0F2A45", borderRadius:16, padding:"26px 30px",
                      boxShadow:"0 20px 60px #0008", border:"1px solid #1A4A7A" }}>
          {!tMode ? (
            <>
              <h2 style={{ margin:"0 0 4px", color:"#E8F4FB", fontSize:16 }}>👤 Connexion étudiant</h2>
              <p style={{ color:"#5B7A9A", fontSize:11, marginBottom:18 }}>
                {QUESTIONS.length} questions · 3 niveaux · 60 secondes par question · Chrono strict
              </p>
              <label style={{ display:"block", color:"#8AACBF", fontSize:12, marginBottom:6, fontWeight:600 }}>
                Nom & Prénom
              </label>
              <input value={name} onChange={e=>setName(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&name.trim().length>=3&&onStudent(name.trim())}
                placeholder="ex : Ben Ali Mohamed"
                style={{ width:"100%", padding:"10px 12px", borderRadius:8,
                         border:"2px solid #1A4A7A", background:"#0A1A2A", color:"#E8F4FB",
                         fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:F }}/>
              <p style={{ color:"#3A6A8A", fontSize:10, marginBottom:16 }}>Minimum 3 caractères</p>
              <button onClick={()=>onStudent(name.trim())} disabled={name.trim().length<3}
                style={{ width:"100%",
                         background:name.trim().length>=3
                           ?"linear-gradient(90deg,#117A65,#1ABC9C)":"#1A3A5A",
                         color:name.trim().length>=3?"#fff":"#3A6A8A",
                         border:"none", borderRadius:8, padding:"12px",
                         fontSize:14, fontWeight:800,
                         cursor:name.trim().length>=3?"pointer":"default", transition:"all 0.2s" }}>
                🚀 Démarrer le QCM
              </button>
              <button onClick={()=>setTMode(true)}
                style={{ width:"100%", background:"none", color:"#3A6A8A",
                         border:"1px solid #1A3A5A", borderRadius:8, padding:"8px",
                         fontSize:12, cursor:"pointer", marginTop:9 }}>
                🔐 Accès enseignant
              </button>
            </>
          ) : (
            <>
              <h2 style={{ margin:"0 0 4px", color:"#1ABC9C", fontSize:16 }}>🔐 Accès enseignant</h2>
              <p style={{ color:"#5B7A9A", fontSize:11, marginBottom:16 }}>
                Tableau de bord avec résultats en temps réel
              </p>
              <label style={{ display:"block", color:"#8AACBF", fontSize:12, marginBottom:6, fontWeight:600 }}>
                Mot de passe
              </label>
              <input type="password" value={pwd}
                onChange={e=>{ setPwd(e.target.value); setPwdErr(false); }}
                onKeyDown={e=>e.key==="Enter"&&(pwd===TEACHER_PWD?onTeacher():setPwdErr(true))}
                placeholder="••••••••"
                style={{ width:"100%", padding:"10px 12px", borderRadius:8,
                         border:`2px solid ${pwdErr?"#E74C3C":"#1A4A7A"}`,
                         background:"#0A1A2A", color:"#E8F4FB", fontSize:14,
                         outline:"none", boxSizing:"border-box", fontFamily:F }}/>
              {pwdErr && <p style={{ color:"#E74C3C", fontSize:11, margin:"3px 0 6px" }}>Mot de passe incorrect</p>}
              <p style={{ color:"#3A6A8A", fontSize:10, marginBottom:16 }}>Indice : iset + année</p>
              <button onClick={()=>pwd===TEACHER_PWD?onTeacher():setPwdErr(true)}
                style={{ width:"100%",
                         background:"linear-gradient(90deg,#117A65,#1ABC9C)",
                         color:"#fff", border:"none", borderRadius:8, padding:"12px",
                         fontSize:14, fontWeight:800, cursor:"pointer" }}>
                📊 Tableau de bord
              </button>
              <button onClick={()=>{ setTMode(false); setPwd(""); setPwdErr(false); }}
                style={{ width:"100%", background:"none", color:"#3A6A8A",
                         border:"1px solid #1A3A5A", borderRadius:8, padding:"8px",
                         fontSize:12, cursor:"pointer", marginTop:9 }}>
                ← Retour
              </button>
            </>
          )}
        </div>
        <p style={{ textAlign:"center", color:"#2A4A6A", fontSize:10, marginTop:12 }}>
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
  const [mode,        setMode       ] = useState("login");
  const [studentName, setStudentName] = useState("");

  if (mode==="teacher") return <TeacherDashboard onBack={()=>setMode("login")}/>;
  if (mode==="student") return <StudentQCM studentName={studentName}/>;
  return (
    <LoginScreen
      onStudent={name=>{ setStudentName(name); setMode("student"); }}
      onTeacher={()=>setMode("teacher")}
    />
  );
}
